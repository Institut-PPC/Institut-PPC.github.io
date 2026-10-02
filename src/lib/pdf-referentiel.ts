import { readFile } from 'node:fs/promises';

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export interface LignePdf {
  texte: string;
  taille: number;
  page: number;
  separationAvant: boolean;
  colonnes: string[];
}

export interface PagePdf {
  numero: number;
  lignes: LignePdf[];
}

interface FragmentPdf {
  texte: string;
  taille: number;
  x: number;
  largeur: number;
}

function colonnesDeLigne(fragments: FragmentPdf[]): string[] {
  const colonnes: string[] = [];
  let colonne = '';
  let finPrecedente: number | undefined;

  for (const fragment of fragments.filter(({ texte }) => texte !== '')) {
    const ecart = finPrecedente === undefined ? 0 : fragment.x - finPrecedente;
    if (colonne.trim() && ecart > 24) {
      colonnes.push(colonne.trim());
      colonne = '';
    }
    colonne += fragment.texte;
    finPrecedente = fragment.x + fragment.largeur;
  }
  if (colonne.trim()) colonnes.push(colonne.trim());
  return colonnes;
}

export async function extrairePagesPdf(cheminPdf: string): Promise<PagePdf[]> {
  const donnees = new Uint8Array(await readFile(cheminPdf));
  const document = await getDocument({ data: donnees, useWorkerFetch: false }).promise;
  const pages: PagePdf[] = [];

  for (let numero = 1; numero <= document.numPages; numero += 1) {
    const page = await document.getPage(numero);
    const contenu = await page.getTextContent();
    const lignes: LignePdf[] = [];
    let fragments: FragmentPdf[] = [];
    let separationAvant = true;

    const terminerLigne = () => {
      const texte = fragments.map((fragment) => fragment.texte).join('').trim();
      if (texte) {
        lignes.push({
          texte,
          taille: Math.max(...fragments.map((fragment) => fragment.taille)),
          page: numero,
          separationAvant,
          colonnes: colonnesDeLigne(fragments),
        });
        separationAvant = false;
      } else {
        separationAvant = true;
      }
      fragments = [];
    };

    for (const item of contenu.items) {
      if (!('str' in item)) continue;
      if (item.str === '' && item.hasEOL) {
        if (fragments.length > 0) terminerLigne();
        separationAvant = true;
        continue;
      }
      fragments.push({
        texte: item.str,
        taille: Math.hypot(item.transform[0], item.transform[1]),
        x: item.transform[4],
        largeur: item.width,
      });
      if (item.hasEOL) terminerLigne();
    }
    if (fragments.length > 0) terminerLigne();

    const derniere = lignes.at(-1);
    if (derniere && /^\d+$/.test(derniere.texte)) lignes.pop();
    pages.push({ numero, lignes });
  }

  return pages;
}

export function texteExtraitDesPages(pages: PagePdf[]): string {
  return pages.map(({ lignes }) => lignes.map(({ texte }) => texte).join('\n')).join('\f');
}
