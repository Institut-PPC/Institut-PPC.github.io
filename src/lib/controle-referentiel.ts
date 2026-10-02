import { readFile } from 'node:fs/promises';

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const TITRE_CHAPITRE_1 = '1. Introduction : comprendre la Pérennité Programmée Circulaire';
const RAYON_CONTEXTE = 6;

function texteMarkdownAffiche(markdown: string): string {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[^\n]*\n([\s\S]*?)```/g, '$1')
    .replace(/~~~[^\n]*\n([\s\S]*?)~~~/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*[-*+] /gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`~|]/g, ' ');
}

function nettoyerArtefactsPdf(texte: string): string {
  return texte
    .replace(/\u00ad/g, '')
    .replace(/([\p{L}\p{M}])-\s*\n\s*(?=[\p{Ll}\p{M}])/gu, '$1')
    .replace(/(?:^|\n)\s*\d+\s*(?=\f|$)/gm, ' ');
}

function tokeniser(texte: string): string[] {
  return texte
    .normalize('NFC')
    .replace(/[\u00a0\u202f]/g, ' ')
    .match(/[\p{L}\p{M}\p{N}]+(?:[’'][\p{L}\p{M}\p{N}]+)*/gu) ?? [];
}

function trouverMeilleurDebut(tokensPdf: string[], tokensMarkdown: string[], marqueur: string[]): number {
  let meilleurDebut = -1;
  let meilleureCorrespondance = -1;
  for (let index = 0; index <= tokensPdf.length - marqueur.length; index += 1) {
    if (!marqueur.every((token, decalage) => tokensPdf[index + decalage] === token)) continue;
    let correspondance = 0;
    const limite = Math.min(tokensMarkdown.length, tokensPdf.length - index);
    while (correspondance < limite && tokensMarkdown[correspondance] === tokensPdf[index + correspondance]) {
      correspondance += 1;
    }
    if (correspondance > meilleureCorrespondance) {
      meilleurDebut = index;
      meilleureCorrespondance = correspondance;
    }
  }
  return meilleurDebut;
}

function formaterContexte(tokens: string[], position: number): string {
  if (position >= tokens.length) return '« fin du texte »';
  const debut = Math.max(0, position - RAYON_CONTEXTE);
  const fin = Math.min(tokens.length, position + RAYON_CONTEXTE + 1);
  const extrait = tokens.slice(debut, fin);
  extrait[position - debut] = `⟦${extrait[position - debut]}⟧`;
  return `« ${extrait.join(' ')} »`;
}

function extraireCorpsPdf(tokensPdf: string[], tokensMarkdown: string[]): string[] | undefined {
  const marqueur = tokeniser(TITRE_CHAPITRE_1);
  const debut = trouverMeilleurDebut(tokensPdf, tokensMarkdown, marqueur);
  return debut === -1 ? undefined : tokensPdf.slice(debut);
}

async function extraireTextePdf(cheminPdf: string): Promise<string> {
  const donnees = new Uint8Array(await readFile(cheminPdf));
  const document = await getDocument({ data: donnees, useWorkerFetch: false }).promise;
  const pages: string[] = [];

  for (let index = 1; index <= document.numPages; index += 1) {
    const page = await document.getPage(index);
    const contenu = await page.getTextContent();
    const fragments = contenu.items.flatMap((item) => (
      'str' in item ? [{ texte: item.str, finDeLigne: item.hasEOL }] : []
    ));
    const dernierNonVide = fragments.findLastIndex(({ texte }) => texte.trim() !== '');
    if (dernierNonVide >= 0 && /^\d+$/.test(fragments[dernierNonVide]!.texte.trim())) {
      fragments.splice(dernierNonVide, 1);
    }
    pages.push(fragments.map(({ texte, finDeLigne }) => `${texte}${finDeLigne ? '\n' : ''}`).join(''));
  }

  return pages.join('\f');
}

export interface ResultatComparaisonReferentiel {
  conforme: boolean;
  nombreTokensMarkdown: number;
  nombreTokensPdf: number;
  tokensIdentiquesAvantEcart: number;
  avertissement?: string;
}

export function comparerTextesReferentiel(markdown: string, textePdf: string): ResultatComparaisonReferentiel {
  const tokensMarkdown = tokeniser(texteMarkdownAffiche(markdown));
  const tokensPdfComplets = tokeniser(nettoyerArtefactsPdf(textePdf));
  const tokensPdf = extraireCorpsPdf(tokensPdfComplets, tokensMarkdown);

  if (tokensMarkdown.length === 0 || tokensPdfComplets.length === 0) {
    return {
      conforme: false,
      nombreTokensMarkdown: tokensMarkdown.length,
      nombreTokensPdf: tokensPdfComplets.length,
      tokensIdentiquesAvantEcart: 0,
      avertissement: 'Comparaison Markdown ↔ PDF impossible : texte exploitable insuffisant.',
    };
  }

  if (!tokensPdf) {
    return {
      conforme: false,
      nombreTokensMarkdown: tokensMarkdown.length,
      nombreTokensPdf: tokensPdfComplets.length,
      tokensIdentiquesAvantEcart: 0,
      avertissement: `Comparaison Markdown ↔ PDF impossible : le début du chapitre 1 (« ${TITRE_CHAPITRE_1} ») est introuvable dans le PDF.`,
    };
  }

  const limite = Math.min(tokensMarkdown.length, tokensPdf.length);
  let position = 0;
  while (position < limite && tokensMarkdown[position] === tokensPdf[position]) position += 1;

  if (position === tokensMarkdown.length && position === tokensPdf.length) {
    return {
      conforme: true,
      nombreTokensMarkdown: tokensMarkdown.length,
      nombreTokensPdf: tokensPdf.length,
      tokensIdentiquesAvantEcart: position,
    };
  }

  const pourcentage = (position / tokensMarkdown.length) * 100;
  return {
    conforme: false,
    nombreTokensMarkdown: tokensMarkdown.length,
    nombreTokensPdf: tokensPdf.length,
    tokensIdentiquesAvantEcart: position,
    avertissement: [
      `Divergence Markdown ↔ PDF au token ${position + 1}.`,
      `${position} tokens identiques avant l’écart (${pourcentage.toFixed(1)} % du Markdown).`,
      `Markdown : ${formaterContexte(tokensMarkdown, position)}.`,
      `PDF : ${formaterContexte(tokensPdf, position)}.`,
    ].join(' '),
  };
}

export async function comparerMarkdownPdf(
  markdown: string,
  cheminPdf: string,
): Promise<ResultatComparaisonReferentiel> {
  return comparerTextesReferentiel(markdown, await extraireTextePdf(cheminPdf));
}
