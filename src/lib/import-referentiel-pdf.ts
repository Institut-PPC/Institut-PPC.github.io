import { extrairePagesPdf, type LignePdf, type PagePdf } from './pdf-referentiel.ts';

const TITRE_CHAPITRE_1 = '1. Introduction : comprendre la Pérennité Programmée Circulaire';

interface BlocPdf {
  texte: string;
  taille: number;
  pageFin: number;
  colonnes?: string[][];
}

export interface ConversionReferentielPdf {
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
    const continuationPage = courant
      && ligne.page !== courant.pageFin
      && !/[.!?…]["»”’)]*$/u.test(courant.texte);
    const compatible = courant
      && (!ligne.separationAvant || continuationPage)
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
      courant!.pageFin = ligne.page;
      continue;
    }

    terminer();
    if (tableau) {
      courant = { texte: ligne.texte, taille: ligne.taille, pageFin: ligne.page, colonnes: [ligne.colonnes] };
    } else {
      courant = { texte: ligne.texte, taille: ligne.taille, pageFin: ligne.page };
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
  const debutChapitre = occurrences.find(({ bloc }) => bloc.taille >= 18)?.index;
  if (debutChapitre === undefined) {
    throw new Error('Impossible d’identifier le chapitre 1 dans le PDF officiel. Vérifier que sa couche texte et sa hiérarchie de titres sont exploitables.');
  }

  const messages: string[] = [];
  const corps = markdownDepuisBlocs(blocs.slice(debutChapitre), messages);
  return { corps, messages: [...new Set(messages)] };
}

export async function convertirPdf(cheminPdf: string): Promise<ConversionReferentielPdf> {
  return convertirPagesPdf(await extrairePagesPdf(cheminPdf));
}
