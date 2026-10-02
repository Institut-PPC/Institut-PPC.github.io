import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { parseDocument } from 'yaml';

import { comparerMarkdownPdf } from '../src/lib/controle-referentiel.ts';
import { schemaReferentiel } from '../src/modeles/referentiel.ts';

const racine = process.cwd();
const cheminMarkdown = path.join(racine, 'contenu/referentiels/ppc/courant.md');
const source = await readFile(cheminMarkdown, 'utf8');
const correspondance = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (!correspondance) throw new Error('Le Markdown courant du Référentiel possède un frontmatter invalide.');

const donnees = schemaReferentiel.parse(parseDocument(correspondance[1]!).toJS());
const version = donnees.versions.find(({ id }) => id === donnees.version_courante);
if (!version) throw new Error('La version courante du Référentiel est introuvable.');

console.log(`PDF utilisé pour la comparaison : ${version.document}`);
const resultat = await comparerMarkdownPdf(
  correspondance[2]!,
  path.join(racine, 'public', version.document.slice(1)),
);
if (resultat.avertissement) console.warn(`AVERTISSEMENT non bloquant : ${resultat.avertissement}`);
else console.log(`Comparaison Markdown ↔ PDF conforme : ${resultat.nombreTokensMarkdown} tokens identiques dans le même ordre.`);
