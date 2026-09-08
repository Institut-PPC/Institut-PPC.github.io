import { describe, expect, it } from 'vitest';

import { schemaPersonne } from '../../src/modeles/personne';

function attendreErreurSur(donnees: unknown, champ: string) {
  const resultat = schemaPersonne.safeParse(donnees);

  expect(resultat.success).toBe(false);
  if (resultat.success) {
    return;
  }

  expect(resultat.error.issues.some((erreur) => erreur.path[0] === champ)).toBe(true);
}

describe('schemaPersonne', () => {
  it('accepte une personne minimale', () => {
    expect(schemaPersonne.safeParse({ prenom: 'Camille', nom: 'Durand' }).success).toBe(true);
  });

  it('accepte un rôle sans exigence de photo ou de LinkedIn', () => {
    expect(
      schemaPersonne.safeParse({
        prenom: 'Camille',
        nom: 'Durand',
        roles_ppc: ['equipe-operationnelle'],
      }).success,
    ).toBe(true);
  });

  it('accepte un membre fondateur avec photo et LinkedIn', () => {
    expect(
      schemaPersonne.safeParse({
        prenom: 'Camille',
        nom: 'Durand',
        roles_ppc: ['membre-fondateur'],
        photo: '../medias/images/personnes/camille-durand.jpg',
        linkedin: 'https://www.linkedin.com/in/camille-durand',
      }).success,
    ).toBe(true);
  });

  it('refuse un membre fondateur sans photo', () => {
    attendreErreurSur(
      {
        prenom: 'Camille',
        nom: 'Durand',
        roles_ppc: ['membre-fondateur'],
        linkedin: 'https://www.linkedin.com/in/camille-durand',
      },
      'photo',
    );
  });

  it('refuse un membre fondateur sans LinkedIn', () => {
    attendreErreurSur(
      {
        prenom: 'Camille',
        nom: 'Durand',
        roles_ppc: ['membre-fondateur'],
        photo: '../medias/images/personnes/camille-durand.jpg',
      },
      'linkedin',
    );
  });

  it.each(['co-presidence', 'conseil-administration', 'conseil-administration-representant-vivant'] as const)(
    'exige photo et LinkedIn pour le rôle %s',
    (role) => {
      const resultat = schemaPersonne.safeParse({
        prenom: 'Camille',
        nom: 'Durand',
        roles_ppc: [role],
      });

      expect(resultat.success).toBe(false);
      if (resultat.success) {
        return;
      }

      expect(resultat.error.issues.map((erreur) => erreur.path)).toEqual(
        expect.arrayContaining([['photo'], ['linkedin']]),
      );
    },
  );

  it('refuse un rôle PPC inconnu', () => {
    attendreErreurSur(
      {
        prenom: 'Camille',
        nom: 'Durand',
        roles_ppc: ['role-inconnu'],
      },
      'roles_ppc',
    );
  });

  it('refuse un identifiant d’organisation non conforme', () => {
    attendreErreurSur(
      {
        prenom: 'Camille',
        nom: 'Durand',
        organisation: 'Organisation PPC',
      },
      'organisation',
    );
  });

  it('accepte une URL LinkedIn HTTPS valide', () => {
    expect(
      schemaPersonne.safeParse({
        prenom: 'Camille',
        nom: 'Durand',
        linkedin: 'https://fr.linkedin.com/in/camille-durand',
      }).success,
    ).toBe(true);
  });

  it.each(['https://example.com/profil', 'https://linkedin.com.example.org/profil'])(
    'refuse une URL HTTPS hors du domaine LinkedIn : %s',
    (linkedin) => {
      attendreErreurSur({ prenom: 'Camille', nom: 'Durand', linkedin }, 'linkedin');
    },
  );

  it('refuse une URL LinkedIn en HTTP', () => {
    attendreErreurSur(
      {
        prenom: 'Camille',
        nom: 'Durand',
        linkedin: 'http://linkedin.com/in/camille-durand',
      },
      'linkedin',
    );
  });

  it('refuse une URL LinkedIn invalide', () => {
    attendreErreurSur(
      {
        prenom: 'Camille',
        nom: 'Durand',
        linkedin: 'profil-linkedin',
      },
      'linkedin',
    );
  });

  it('refuse les chaînes obligatoires vides', () => {
    attendreErreurSur({ prenom: ' ', nom: 'Durand' }, 'prenom');
    attendreErreurSur({ prenom: 'Camille', nom: '' }, 'nom');
  });

  it('refuse un champ étranger au modèle canonique', () => {
    const resultat = schemaPersonne.safeParse({ prenom: 'Camille', nom: 'Durand', publie: true });

    expect(resultat.success).toBe(false);
    if (resultat.success) {
      return;
    }

    expect(resultat.error.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'unrecognized_keys', keys: ['publie'] })]),
    );
  });
});
