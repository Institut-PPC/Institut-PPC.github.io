import { describe, expect, it } from 'vitest';

import { comparerTextesReferentiel } from '../src/lib/controle-referentiel';

const titre = '1. Introduction : comprendre la Pérennité Programmée Circulaire';
const markdown = [
  `# ${titre}`,
  '',
  '## 1.1 Définition de la PPC',
  '',
  'La pérennité organise la conservation de la valeur.',
  '',
  '## 1.2 Mise en œuvre',
  '',
  'Le modèle reste robuste et réparable.',
].join('\n');
const textePdf = [
  titre,
  '1.1 Définition de la PPC',
  'La pérennité organise la conservation de la valeur.',
  '1.2 Mise en œuvre',
  'Le modèle reste robuste et réparable.',
].join('\n');

describe('comparaison séquentielle du Référentiel PPC', () => {
  it('accepte deux séquences textuelles identiques', () => {
    const resultat = comparerTextesReferentiel(markdown, textePdf);

    expect(resultat.conforme).toBe(true);
    expect(resultat.avertissement).toBeUndefined();
    expect(resultat.nombreTokensMarkdown).toBe(resultat.nombreTokensPdf);
  });

  it('signale un mot modifié avec la position et les deux contextes', () => {
    const resultat = comparerTextesReferentiel(markdown, textePdf.replace('robuste', 'durable'));

    expect(resultat.conforme).toBe(false);
    expect(resultat.avertissement).toContain('Divergence Markdown ↔ PDF au token');
    expect(resultat.avertissement).toContain('Markdown :');
    expect(resultat.avertissement).toContain('PDF :');
    expect(resultat.avertissement).toContain('⟦robuste⟧');
    expect(resultat.avertissement).toContain('⟦durable⟧');
  });

  it('signale un mot manquant dans le PDF', () => {
    const resultat = comparerTextesReferentiel(markdown, textePdf.replace('robuste et ', ''));

    expect(resultat.conforme).toBe(false);
    expect(resultat.avertissement).toContain('⟦robuste⟧');
    expect(resultat.avertissement).toContain('⟦réparable⟧');
  });

  it('signale un mot ajouté dans le PDF', () => {
    const resultat = comparerTextesReferentiel(markdown, textePdf.replace('robuste et', 'robuste vraiment et'));

    expect(resultat.conforme).toBe(false);
    expect(resultat.avertissement).toContain('⟦et⟧');
    expect(resultat.avertissement).toContain('⟦vraiment⟧');
  });

  it('signale deux paragraphes inversés', () => {
    const pdfInverse = textePdf.replace(
      'La pérennité organise la conservation de la valeur.\n1.2 Mise en œuvre\nLe modèle reste robuste et réparable.',
      'Le modèle reste robuste et réparable.\n1.2 Mise en œuvre\nLa pérennité organise la conservation de la valeur.',
    );

    expect(comparerTextesReferentiel(markdown, pdfInverse).conforme).toBe(false);
  });

  it('ignore les différences de retours à la ligne et d’espaces', () => {
    const pdfRecompose = textePdf.replace(/ /g, '  \n ');

    expect(comparerTextesReferentiel(markdown, pdfRecompose).conforme).toBe(true);
  });

  it('réunit une césure artificielle produite par le PDF', () => {
    const markdownAvecCesure = markdown.replace('robuste', 'réparable');
    const pdfAvecCesure = textePdf.replace('robuste', 'répa-\nrable');

    expect(comparerTextesReferentiel(markdownAvecCesure, pdfAvecCesure).conforme).toBe(true);
  });

  it('considère une différence d’accent comme une divergence', () => {
    const resultat = comparerTextesReferentiel(markdown, textePdf.replace('pérennité', 'perennité'));

    expect(resultat.conforme).toBe(false);
    expect(resultat.avertissement).toContain('⟦pérennité⟧');
    expect(resultat.avertissement).toContain('⟦perennité⟧');
  });

  it('ignore le texte et le sommaire placés avant la dernière occurrence du chapitre 1', () => {
    const pdfAvecAvantPropos = [
      'Avant-propos sans rapport avec le corps.',
      `${titre} 6 1.1 Définition de la PPC 6`,
      '\f',
      textePdf,
    ].join('\n');

    expect(comparerTextesReferentiel(markdown, pdfAvecAvantPropos).conforme).toBe(true);
  });

  it('ignore la syntaxe Markdown qui ne fait pas partie du texte affiché', () => {
    const markdownEnrichi = markdown
      .replace('conservation', '**conservation**')
      .replace('valeur', '[valeur](https://example.org/source)');

    expect(comparerTextesReferentiel(markdownEnrichi, textePdf).conforme).toBe(true);
  });
});
