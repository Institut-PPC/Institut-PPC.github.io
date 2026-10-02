import type { Referentiel } from '../modeles/referentiel.ts';
import { extrairePagesPdf, type LignePdf, type PagePdf } from './pdf-referentiel.ts';

const TITRE_CHAPITRE_1 = '1. Introduction : comprendre la Pérennité Programmée Circulaire';

interface BlocPdf {
  texte: string;
  taille: number;
  colonnes?: string[][];
}

export interface ConversionReferentielPdf {
  preambule: Referentiel['preambule'];
  corps: string;
  messages: string[];
}

function normaliserEspaces(texte: string): string {
  return texte.replace(/[\u00a0\u202f]/g, ' ').replace(/\s+/g, ' ').trim();
}

function reunir(texte: string, suite: string): string {
  const gauche = texte.trimEnd();
  const droite = suite.trimStart();
  if (/\p{L}-$/u.test(gauche) && /^\p{Ll}/u.test(droite)) return `${gauche.slice(0, -1)}${droite}`;
  return `${gauche} ${droite}`;
}

function regrouperLignes(lignes: LignePdf[]): BlocPdf[] {
  const blocs: BlocPdf[] = [];
  let courant: BlocPdf | undefined;

  const terminer = () => {
    if (courant) blocs.push({ ...courant, texte: normaliserEspaces(courant.texte) });
    courant = undefined;
  };

  for (const ligne of lignes) {
    const titre = ligne.taille >= 14;
    const liste = /^\d+[.)]\s+|^[•●▪◦]\s*/u.test(ligne.texte);
    const tableau = ligne.colonnes.length >= 2;
    const nouvelleStructure = titre || liste || tableau;
    const compatible = courant
      && !ligne.separationAvant
      && !nouvelleStructure
      && !courant.colonnes
      && courant.taille < 14;
    const titreMultiligne = courant
      && titre
      && courant.taille >= 14
      && Math.abs(courant.taille - ligne.taille) < 0.5
      && !ligne.separationAvant;

    if (compatible || titreMultiligne) {
      courant!.texte = reunir(courant!.texte, ligne.texte);
      continue;
    }

    terminer();
    if (tableau) {
      courant = { texte: ligne.texte, taille: ligne.taille, colonnes: [ligne.colonnes] };
    } else {
      courant = { texte: ligne.texte, taille: ligne.taille };
    }
  }
  terminer();
  return blocs;
}

function convertirTableau(lignes: string[][]): string {
  const largeur = Math.max(...lignes.map((ligne) => ligne.length));
  const cellules = lignes.map((ligne) => [...ligne, ...Array.from({ length: largeur - ligne.length }, () => '')]);
  const ligneMarkdown = (ligne: string[]) => `| ${ligne.join(' | ')} |`;
  return [
    ligneMarkdown(cellules[0]!),
    ligneMarkdown(Array.from({ length: largeur }, () => '---')),
    ...cellules.slice(1).map(ligneMarkdown),
  ].join('\n');
}

function preambuleDepuisBlocs(blocs: BlocPdf[]): Referentiel['preambule'] {
  const utiles = blocs.filter(({ texte }) => (
    !/^Référentiel de la Pérennité Programmée Circulaire$/i.test(texte)
    && !/^Version\b/i.test(texte)
  ));
  const sections: Referentiel['preambule'] = [];
  let section: Referentiel['preambule'][number] | undefined;

  for (let index = 0; index < utiles.length; index += 1) {
    const bloc = utiles[index]!;
    const suivant = utiles[index + 1];
    const titreProbable = bloc.texte.split(/\s+/).length <= 8
      && !/[.!?;:]$/.test(bloc.texte)
      && Boolean(suivant && suivant.texte.split(/\s+/).length > 8);
    if (titreProbable) {
      section = { titre: bloc.texte, paragraphes: [] };
      sections.push(section);
    } else if (section) {
      section.paragraphes.push(bloc.texte);
    }
  }
  return sections.filter(({ paragraphes }) => paragraphes.length > 0);
}

function markdownDepuisBlocs(blocs: BlocPdf[], messages: string[]): string {
  const morceaux: string[] = [];
  for (let index = 0; index < blocs.length; index += 1) {
    const bloc = blocs[index]!;
    if (bloc.taille >= 18) morceaux.push(`# ${bloc.texte}`);
    else if (bloc.taille >= 14) morceaux.push(`## ${bloc.texte}`);
    else if (bloc.colonnes) {
      const lignes: string[][] = [...bloc.colonnes];
      while (blocs[index + 1]?.colonnes) lignes.push(...blocs[++index]!.colonnes!);
      morceaux.push(convertirTableau(lignes));
      messages.push('Un tableau PDF a été reconstruit heuristiquement ; vérifier ses cellules dans le diff.');
    } else if (/^[•●▪◦]\s*/u.test(bloc.texte)) morceaux.push(`- ${bloc.texte.replace(/^[•●▪◦]\s*/u, '')}`);
    else morceaux.push(bloc.texte);
  }
  return morceaux.join('\n\n').trim();
}

export function convertirPagesPdf(pages: PagePdf[]): ConversionReferentielPdf {
  const lignes = pages.flatMap(({ lignes: lignesPage }) => lignesPage);
  const blocs = regrouperLignes(lignes);
  const occurrences = blocs
    .map((bloc, index) => ({ bloc, index }))
    .filter(({ bloc }) => bloc.texte.startsWith(TITRE_CHAPITRE_1));
  const debutSommaire = occurrences[0]?.index;
  const debutChapitre = occurrences.find(({ bloc }) => bloc.taille >= 18)?.index;
  if (debutChapitre === undefined) {
    throw new Error('Impossible d’identifier le chapitre 1 dans le PDF officiel. Vérifier que sa couche texte et sa hiérarchie de titres sont exploitables.');
  }

  const finPreambule = debutSommaire === undefined ? debutChapitre : debutSommaire;
  const preambule = preambuleDepuisBlocs(blocs.slice(0, finPreambule));
  if (preambule.length === 0) throw new Error('Impossible d’extraire un préambule structuré avant le chapitre 1 du PDF officiel.');

  const messages: string[] = [];
  const corps = markdownDepuisBlocs(blocs.slice(debutChapitre), messages);
  return { preambule, corps, messages: [...new Set(messages)] };
}

export async function convertirPdf(cheminPdf: string): Promise<ConversionReferentielPdf> {
  return convertirPagesPdf(await extrairePagesPdf(cheminPdf));
}
