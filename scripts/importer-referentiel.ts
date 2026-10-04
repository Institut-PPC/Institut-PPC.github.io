import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { parseDocument, stringify } from 'yaml';

import { comparerMarkdownPdf } from '../src/lib/controle-referentiel.ts';
import { convertirPdf } from '../src/lib/import-referentiel-pdf.ts';
import { erreursStructureReferentiel } from '../src/lib/referentiel-ppc.ts';
import { schemaReferentiel, type Referentiel } from '../src/modeles/referentiel.ts';
import { validerContenus } from '../src/validation/contenus.ts';

const racine = process.cwd();
const cheminCourant = path.join(racine, 'contenu/referentiels/ppc/courant.md');

interface OptionsImport {
  pdf: string;
  version: string;
  date: string;
  document: string;
}

function lireOptions(argumentsCli: string[]): OptionsImport {
  const [pdf, ...reste] = argumentsCli;
  const options = new Map<string, string>();
  for (let index = 0; index < reste.length; index += 2) {
    const cle = reste[index];
    const valeur = reste[index + 1];
    if (!cle?.startsWith('--') || !valeur) throw new Error('Syntaxe invalide.');
    options.set(cle, valeur);
  }

  if (!pdf || !options.get('--version') || !options.get('--date')) {
    throw new Error('Usage : npm run referentiel:import -- public/documents/referentiels/referentiel-ppc/<fichier>.pdf --version X.Y --date YYYY-MM-DD');
  }

  const version = options.get('--version')!;
  const date = options.get('--date')!;
  const document = `/documents/referentiels/referentiel-ppc/${date}_Referentiel-PPC_v${version}.pdf`;
  return {
    pdf: pdf.startsWith('/documents/')
      ? path.join(racine, 'public', pdf.slice(1))
      : path.resolve(racine, pdf),
    version,
    date,
    document,
  };
}

function decomposerMarkdown(source: string): { donnees: Referentiel; corps: string } {
  const correspondance = source.replace(/^\uFEFF/, '').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!correspondance) throw new Error('Le Markdown courant ne possède pas un frontmatter YAML valide.');
  const document = parseDocument(correspondance[1]!);
  if (document.errors.length > 0) throw new Error(`Frontmatter YAML invalide : ${document.errors[0]!.message}`);
  return { donnees: schemaReferentiel.parse(document.toJS()), corps: correspondance[2]! };
}

async function executer(): Promise<void> {
  const options = lireOptions(process.argv.slice(2));
  await access(options.pdf);
  const cheminAttendu = path.join(racine, 'public', options.document.slice(1));
  if (options.pdf !== cheminAttendu) {
    throw new Error(`Le PDF d’entrée doit être le fichier officiel publié « ${cheminAttendu} ».`);
  }

  const sourceInitiale = await readFile(cheminCourant, 'utf8');
  const courant = decomposerMarkdown(sourceInitiale);
  const conversion = await convertirPdf(options.pdf);
  const erreursStructure = erreursStructureReferentiel(conversion.corps);
  if (erreursStructure.length > 0) throw new Error(erreursStructure.join('\n'));

  const idVersion = `v${options.version.replaceAll('.', '-')}`;
  const versionExistante = courant.donnees.versions.find((version) => version.id === idVersion);
  const nouvelleVersion = { id: idVersion, version: options.version, date_publication: options.date, document: options.document };
  if (versionExistante && JSON.stringify(versionExistante) !== JSON.stringify(nouvelleVersion)) {
    throw new Error(`L’historique contient déjà « ${idVersion} » avec d’autres métadonnées.`);
  }

  const donnees = schemaReferentiel.parse({
    ...courant.donnees,
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

  console.log(`PDF utilisé pour l’import et la comparaison : ${options.document}`);
  const comparaison = await comparerMarkdownPdf(conversion.corps, options.pdf);
  for (const message of conversion.messages) console.warn(`Avertissement PDF : ${message}`);
  if (comparaison.avertissement) console.warn(`Avertissement : ${comparaison.avertissement}`);
  else console.log(`Comparaison Markdown ↔ PDF conforme : ${comparaison.nombreTokensMarkdown} tokens identiques dans le même ordre.`);
  console.log(`Import terminé : version ${options.version}. Vérification humaine finale obligatoire avant commit.`);
}

executer().catch((erreur) => {
  console.error(erreur instanceof Error ? erreur.message : String(erreur));
  process.exitCode = 1;
});
