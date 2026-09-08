import { describe, expect, it } from 'vitest';

import { schemaEvenement } from '../../src/modeles/evenement';

const evenementMinimal = {
  titre: 'Rencontre PPC',
  slug: 'rencontre-ppc',
  resume: 'Présentation de la rencontre.',
  date_debut: '2026-09-08T10:30:00+02:00',
  relation_ppc: 'organise-par-ppc' as const,
  publie: false,
};

describe('schemaEvenement', () => {
  it.each(['organise-par-ppc', 'evenement-externe'] as const)(
    'accepte un événement minimal avec la relation %s',
    (relation_ppc) => {
      expect(schemaEvenement.safeParse({ ...evenementMinimal, relation_ppc }).success).toBe(true);
    },
  );

  it('refuse une relation PPC inconnue', () => {
    expect(schemaEvenement.safeParse({ ...evenementMinimal, relation_ppc: 'inconnue' }).success).toBe(false);
  });

  it.each([
    { organisations_liees: ['Organisation PPC'] },
    { personnes_liees: ['personne_invalide'] },
  ])('refuse un identifiant de relation invalide', (relations) => {
    expect(schemaEvenement.safeParse({ ...evenementMinimal, ...relations }).success).toBe(false);
  });

  it('refuse une URL externe invalide', () => {
    expect(schemaEvenement.safeParse({ ...evenementMinimal, lien_externe: 'inscription' }).success).toBe(false);
  });

  it('refuse une date-heure arbitraire', () => {
    expect(schemaEvenement.safeParse({ ...evenementMinimal, date_debut: 'demain matin' }).success).toBe(false);
  });

  it('refuse un texte alternatif sans image', () => {
    expect(schemaEvenement.safeParse({ ...evenementMinimal, image_alt: 'Description' }).success).toBe(false);
  });
});
