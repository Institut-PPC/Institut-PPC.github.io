import { describe, expect, it } from 'vitest';

import { schemaOrganisation } from '../../src/modeles/organisation';

function attendreErreurSur(donnees: unknown, champ: string) {
  const resultat = schemaOrganisation.safeParse(donnees);

  expect(resultat.success).toBe(false);
  if (resultat.success) return;

  expect(resultat.error.issues.some((erreur) => erreur.path[0] === champ)).toBe(true);
}

describe('schemaOrganisation', () => {
  it('accepte une organisation minimale', () => {
    expect(schemaOrganisation.safeParse({ nom: 'Organisation PPC' }).success).toBe(true);
  });

  it.each(['partenaire', 'mecene'] as const)('accepte le rôle PPC %s', (role) => {
    expect(schemaOrganisation.safeParse({ nom: 'Organisation PPC', roles_ppc: [role] }).success).toBe(true);
  });

  it('accepte les champs facultatifs structurés', () => {
    expect(
      schemaOrganisation.safeParse({
        nom: 'Organisation PPC',
        site_web: 'https://example.org/organisation',
        logo: '../medias/images/organisations/organisation-ppc.svg',
        description_courte: 'Une organisation engagée dans la PPC.',
      }).success,
    ).toBe(true);
  });

  it('refuse un nom vide', () => {
    attendreErreurSur({ nom: ' ' }, 'nom');
  });

  it('refuse un rôle PPC inconnu', () => {
    attendreErreurSur({ nom: 'Organisation PPC', roles_ppc: ['membre'] }, 'roles_ppc');
  });

  it.each(['organisation.example.org', 'ftp://example.org'])('refuse une URL de site Web invalide : %s', (site_web) => {
    attendreErreurSur({ nom: 'Organisation PPC', site_web }, 'site_web');
  });

  it('refuse un champ étranger au modèle canonique', () => {
    const resultat = schemaOrganisation.safeParse({ nom: 'Organisation PPC', publie: true });

    expect(resultat.success).toBe(false);
    if (resultat.success) return;

    expect(resultat.error.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'unrecognized_keys', keys: ['publie'] })]),
    );
  });
});
