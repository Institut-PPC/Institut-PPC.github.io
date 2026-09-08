import { describe, expect, it } from 'vitest';

import { schemaActualite } from '../../src/modeles/actualite';

const actualiteMinimale = {
  titre: 'Une actualité PPC',
  slug: 'une-actualite-ppc',
  resume: 'Résumé de l’actualité.',
  date_publication: '2026-09-08',
  publie: false,
};

describe('schemaActualite', () => {
  it('accepte une actualité minimale', () => {
    expect(schemaActualite.safeParse(actualiteMinimale).success).toBe(true);
  });

  it('refuse un slug invalide', () => {
    expect(schemaActualite.safeParse({ ...actualiteMinimale, slug: 'Actualité PPC' }).success).toBe(false);
  });

  it('refuse un champ obligatoire vide', () => {
    expect(schemaActualite.safeParse({ ...actualiteMinimale, titre: ' ' }).success).toBe(false);
  });

  it('refuse une date de publication invalide', () => {
    expect(schemaActualite.safeParse({ ...actualiteMinimale, date_publication: '2026-02-30' }).success).toBe(false);
  });

  it('refuse un texte alternatif sans image principale', () => {
    expect(schemaActualite.safeParse({ ...actualiteMinimale, image_alt: 'Description' }).success).toBe(false);
  });
});
