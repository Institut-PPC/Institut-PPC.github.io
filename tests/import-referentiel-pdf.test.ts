import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { comparerMarkdownPdf } from '../src/lib/controle-referentiel';
import { convertirPagesPdf, convertirPdf } from '../src/lib/import-referentiel-pdf';
import type { LignePdf, PagePdf } from '../src/lib/pdf-referentiel';
import { erreursStructureReferentiel } from '../src/lib/referentiel-ppc';

function ligne(
  texte: string,
  taille = 11,
  separationAvant = true,
  colonnes: string[] = [texte],
  page = 1,
): LignePdf {
  return { texte, taille, separationAvant, colonnes, page };
}

describe('import PDF du Référentiel PPC', () => {
  it('ignore le préambule et reconstruit titres, paragraphes, listes et tableaux', () => {
    const pages: PagePdf[] = [
      {
        numero: 1,
        lignes: [
          ligne('Référentiel de la Pérennité Programmée Circulaire', 26),
          ligne('Version 2.0 - 1 janvier 2027'),
          ligne('Objet du document'),
          ligne('Ce préambule présente la publication officielle et son contexte complet.'),
          ligne('1. Introduction : comprendre la Pérennité Programmée Circulaire 6'),
        ],
      },
      {
        numero: 2,
        lignes: [
          ligne('1. Introduction : comprendre la Pérennité Programmée Circulaire', 20, true, undefined, 2),
          ligne('1.1 Définition de la PPC', 16, true, undefined, 2),
          ligne('Un premier paragraphe réparti sur', 11, true, undefined, 2),
          ligne('deux lignes dans le PDF.', 11, false, undefined, 2),
          ligne('Une phrase continue sur la page', 11, true, undefined, 2),
        ],
      },
      {
        numero: 3,
        lignes: [
          ligne('suivante sans devenir un nouveau paragraphe.', 11, true, undefined, 3),
          ligne('1. premier élément', 11, true, undefined, 3),
          ligne('Colonne A Colonne B', 11, true, ['Colonne A', 'Colonne B'], 3),
          ligne('Valeur A Valeur B', 11, true, ['Valeur A', 'Valeur B'], 3),
        ],
      },
    ];

    const resultat = convertirPagesPdf(pages);

    expect(resultat.corps).not.toContain('Objet du document');
    expect(resultat.corps).not.toContain('Ce préambule présente la publication officielle');
    expect(resultat.corps).toContain('# 1. Introduction : comprendre la Pérennité Programmée Circulaire');
    expect(resultat.corps).toContain('## 1.1 Définition de la PPC');
    expect(resultat.corps).toContain('Un premier paragraphe réparti sur deux lignes dans le PDF.');
    expect(resultat.corps).toContain('Une phrase continue sur la page suivante sans devenir un nouveau paragraphe.');
    expect(resultat.corps).toContain('1. premier élément');
    expect(resultat.corps).toContain('| Colonne A | Colonne B |');
    expect(resultat.corps).toContain('| --- | --- |');
    expect(resultat.messages).toContain('Un tableau PDF a été reconstruit heuristiquement ; vérifier ses cellules dans le diff.');
  });

  it('reconstruit le PDF officiel courant et produit un Markdown textuellement conforme', async () => {
    const cheminPdf = path.resolve(
      'public/documents/referentiels/referentiel-ppc/2026-09-29_Referentiel-PPC_v1.0.pdf',
    );

    const conversion = await convertirPdf(cheminPdf);
    const comparaison = await comparerMarkdownPdf(conversion.corps, cheminPdf);

    expect(erreursStructureReferentiel(conversion.corps)).toEqual([]);
    expect(conversion.corps).toContain('La durée, la fiabilité et la valeur résiduelle');
    expect(conversion.corps).toContain('Une information incomplète ou non fiable peut produire');
    expect(comparaison.conforme).toBe(true);
    expect(comparaison.nombreTokensMarkdown).toBeGreaterThan(0);
  });
});
