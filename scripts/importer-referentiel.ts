import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { parseDocument, stringify } from 'yaml';

import { comparerMarkdownPdf } from '../src/lib/controle-referentiel.ts';
import { erreursStructureReferentiel } from '../src/lib/referentiel-ppc.ts';
import { schemaReferentiel, type Referentiel } from '../src/modeles/referentiel.ts';
import { validerContenus } from '../src/validation/contenus.ts';

const racine = process.cwd();
const cheminCourant = path.join(racine, 'contenu/referentiels/ppc/courant.md');

interface OptionsImport {
  docx: string;
  version: string;
  date: string;
  pdf: string;
}

function lireOptions(argumentsCli: string[]): OptionsImport {
  const [docx, ...reste] = argumentsCli;
  const options = new Map<string, string>();
  for (let index = 0; index < reste.length; index += 2) {
    const cle = reste[index];
    const valeur = reste[index + 1];
    if (!cle?.startsWith('--') || !valeur) throw new Error('Syntaxe invalide.');
    options.set(cle, valeur);
  }

  if (!docx || !options.get('--version') || !options.get('--date') || !options.get('--pdf')) {
    throw new Error('Usage : npm run referentiel:import -- <fichier.docx> --version X.Y --date YYYY-MM-DD --pdf /documents/referentiels/referentiel-ppc/<fichier>.pdf');
  }

  return {
    docx: path.resolve(racine, docx),
    version: options.get('--version')!,
    date: options.get('--date')!,
    pdf: options.get('--pdf')!,
  };
}

function decomposerMarkdown(source: string): { donnees: Referentiel; corps: string } {
  const correspondance = source.replace(/^\uFEFF/, '').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!correspondance) throw new Error('Le Markdown courant ne possède pas un frontmatter YAML valide.');
  const document = parseDocument(correspondance[1]!);
  if (document.errors.length > 0) throw new Error(`Frontmatter YAML invalide : ${document.errors[0]!.message}`);
  return { donnees: schemaReferentiel.parse(document.toJS()), corps: correspondance[2]! };
}

function nettoyerMarkdown(markdown: string): string {
  return markdown
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extrairePreambule(markdownAvantChapitre: string): Referentiel['preambule'] {
  let source = markdownAvantChapitre
    .replace(/^#\s+Référentiel[^\n]*\n+/i, '')
    .replace(/^Version[^\n]*\n+/i, '')
    .trim();

  const debutSommaire = source.search(/^(?:\[[^\]]*)?1\.\s+Introduction\b/im);
  if (debutSommaire >= 0) source = source.slice(0, debutSommaire).trim();

  const sections: Referentiel['preambule'] = [];
  let sectionCourante: Referentiel['preambule'][number] | undefined;
  for (const bloc of source.split(/\n{2,}/)) {
    const titre = bloc.match(/^(?:#{1,4}\s+|\*\*)(.+?)(?:\*\*)?$/)?.[1]?.trim();
    if (titre) {
      sectionCourante = { titre, paragraphes: [] };
      sections.push(sectionCourante);
      continue;
    }
    if (sectionCourante && bloc.trim()) sectionCourante.paragraphes.push(bloc.replace(/\n/g, ' ').trim());
  }

  return sections.filter((section) => section.paragraphes.length > 0);
}

async function convertirDocx(docx: string): Promise<{ preambule: Referentiel['preambule']; corps: string; messages: string[] }> {
  const resultat = await mammoth.convertToHtml(
    { path: docx },
    {
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
      ],
      includeDefaultStyleMap: true,
    },
  );
  const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*', strongDelimiter: '**' });
  turndown.use(gfm);
  turndown.remove(['style', 'script']);
  const markdown = nettoyerMarkdown(turndown.turndown(resultat.value));
  const debutChapitre = markdown.search(/^#\s+1\.\s+/m);
  if (debutChapitre < 0) throw new Error('Impossible d’identifier le chapitre 1 dans le DOCX. Vérifier les styles de titres Google Docs.');

  const corps = markdown.slice(debutChapitre).trim();
  const preambule = extrairePreambule(markdown.slice(0, debutChapitre));
  if (preambule.length === 0) throw new Error('Impossible d’extraire un préambule structuré avant le chapitre 1.');

  return {
    preambule,
    corps,
    messages: resultat.messages.map((message) => message.message),
  };
}

async function executer(): Promise<void> {
  const options = lireOptions(process.argv.slice(2));
  await access(options.docx);

  const attenduPdf = `/documents/referentiels/referentiel-ppc/${options.date}_Referentiel-PPC_v${options.version}.pdf`;
  if (options.pdf !== attenduPdf) throw new Error(`Le PDF attendu pour ces métadonnées est « ${attenduPdf} ».`);
  const cheminPdf = path.join(racine, 'public', options.pdf.slice(1));
  await access(cheminPdf);

  const sourceInitiale = await readFile(cheminCourant, 'utf8');
  const courant = decomposerMarkdown(sourceInitiale);
  const conversion = await convertirDocx(options.docx);
  const erreursStructure = erreursStructureReferentiel(conversion.corps);
  if (erreursStructure.length > 0) throw new Error(erreursStructure.join('\n'));

  const idVersion = `v${options.version.replaceAll('.', '-')}`;
  const versionExistante = courant.donnees.versions.find((version) => version.id === idVersion);
  const nouvelleVersion = { id: idVersion, version: options.version, date_publication: options.date, document: options.pdf };
  if (versionExistante && JSON.stringify(versionExistante) !== JSON.stringify(nouvelleVersion)) {
    throw new Error(`L’historique contient déjà « ${idVersion} » avec d’autres métadonnées.`);
  }

  const donnees = schemaReferentiel.parse({
    ...courant.donnees,
    preambule: conversion.preambule,
    version_courante: idVersion,
    versions: versionExistante ? courant.donnees.versions : [...courant.donnees.versions, nouvelleVersion],
  });
  const nouvelleSource = `---\n${stringify(donnees, { lineWidth: 100 })}---\n\n${conversion.corps}\n`;

  await writeFile(cheminCourant, nouvelleSource, 'utf8');
  const rapport = await validerContenus(racine);
  if (rapport.erreurs.length > 0) {
    await writeFile(cheminCourant, sourceInitiale, 'utf8');
    throw new Error(`Import annulé :\n${rapport.erreurs.map((erreur) => `- ${erreur.chemin} : ${erreur.message}`).join('\n')}`);
  }

  const comparaison = await comparerMarkdownPdf(conversion.corps, cheminPdf);
  for (const message of conversion.messages) console.warn(`Avertissement DOCX : ${message}`);
  if (comparaison.avertissement) console.warn(`Avertissement : ${comparaison.avertissement}`);
  else console.log(`Comparaison Markdown ↔ PDF : ${(comparaison.couverture * 100).toFixed(1)} % des séquences retrouvées.`);
  console.log(`Import terminé : version ${options.version}. Vérification humaine finale obligatoire avant commit.`);
}

executer().catch((erreur) => {
  console.error(erreur instanceof Error ? erreur.message : String(erreur));
  process.exitCode = 1;
});
