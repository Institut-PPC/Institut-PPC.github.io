import { readFile } from 'node:fs/promises';

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

function normaliserTexte(texte: string): string[] {
  return texte
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 $2')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*(?:[-*+] |\d+\. )/gm, '')
    .replace(/[*_`>|~]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

async function extraireTextePdf(cheminPdf: string): Promise<string> {
  const donnees = new Uint8Array(await readFile(cheminPdf));
  const document = await getDocument({ data: donnees, useWorkerFetch: false }).promise;
  const pages: string[] = [];

  for (let index = 1; index <= document.numPages; index += 1) {
    const page = await document.getPage(index);
    const contenu = await page.getTextContent();
    pages.push(contenu.items.map((item) => ('str' in item ? item.str : '')).join(' '));
  }

  return pages.join('\n');
}

export interface ResultatComparaisonReferentiel {
  couverture: number;
  avertissement?: string;
}

export async function comparerMarkdownPdf(
  markdown: string,
  cheminPdf: string,
): Promise<ResultatComparaisonReferentiel> {
  const tokensMarkdown = normaliserTexte(markdown);
  const tokensPdf = normaliserTexte(await extraireTextePdf(cheminPdf));
  const tailleFenetre = 5;

  if (tokensMarkdown.length < tailleFenetre || tokensPdf.length < tailleFenetre) {
    return { couverture: 0, avertissement: 'Comparaison Markdown ↔ PDF impossible : texte exploitable insuffisant.' };
  }

  const signaturesPdf = new Set<string>();
  for (let index = 0; index <= tokensPdf.length - tailleFenetre; index += 1) {
    signaturesPdf.add(tokensPdf.slice(index, index + tailleFenetre).join(' '));
  }

  let signaturesPresentes = 0;
  let signaturesMarkdown = 0;
  for (let index = 0; index <= tokensMarkdown.length - tailleFenetre; index += tailleFenetre) {
    signaturesMarkdown += 1;
    if (signaturesPdf.has(tokensMarkdown.slice(index, index + tailleFenetre).join(' '))) {
      signaturesPresentes += 1;
    }
  }

  const couverture = signaturesMarkdown === 0 ? 0 : signaturesPresentes / signaturesMarkdown;
  if (couverture >= 0.90) return { couverture };

  return {
    couverture,
    avertissement: `La comparaison Markdown ↔ PDF ne retrouve que ${(couverture * 100).toFixed(1)} % des séquences textuelles du Markdown dans le PDF. Une vérification humaine approfondie est requise.`,
  };
}
