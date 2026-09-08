import { describe, expect, it } from 'vitest';

import { schemaReferentiel } from '../../src/modeles/referentiel';

const referentielSansVersion = {
  titre: 'Référentiel PPC',
  resume: 'Présentation du référentiel.',
  versions: [],
  publie: false,
};

const versionCourante = {
  id: 'v1-0',
  version: '1.0',
};

describe('schemaReferentiel', () => {
  it('accepte un référentiel sans version ni version courante', () => {
    expect(schemaReferentiel.safeParse(referentielSansVersion).success).toBe(true);
  });

  it('accepte un référentiel avec une version courante valide', () => {
    expect(
      schemaReferentiel.safeParse({
        ...referentielSansVersion,
        versions: [versionCourante],
        version_courante: versionCourante.id,
      }).success,
    ).toBe(true);
  });

  it('refuse des versions sans version courante', () => {
    expect(
      schemaReferentiel.safeParse({ ...referentielSansVersion, versions: [versionCourante] }).success,
    ).toBe(false);
  });

  it('refuse une version courante inconnue', () => {
    expect(
      schemaReferentiel.safeParse({
        ...referentielSansVersion,
        versions: [versionCourante],
        version_courante: 'v2-0',
      }).success,
    ).toBe(false);
  });

  it('refuse un doublon d’identifiant de version', () => {
    expect(
      schemaReferentiel.safeParse({
        ...referentielSansVersion,
        versions: [versionCourante, { ...versionCourante, version: 'Version dupliquée' }],
        version_courante: versionCourante.id,
      }).success,
    ).toBe(false);
  });

  it('accepte un document externe HTTP(S)', () => {
    expect(
      schemaReferentiel.safeParse({
        ...referentielSansVersion,
        versions: [{ ...versionCourante, document: 'https://example.org/referentiel.pdf' }],
        version_courante: versionCourante.id,
      }).success,
    ).toBe(true);
  });

  it('accepte un document public local sous /documents/', () => {
    expect(
      schemaReferentiel.safeParse({
        ...referentielSansVersion,
        versions: [{ ...versionCourante, document: '/documents/referentiels/ppc/v1-0.pdf' }],
        version_courante: versionCourante.id,
      }).success,
    ).toBe(true);
  });

  it('refuse un document local hors de /documents/', () => {
    expect(
      schemaReferentiel.safeParse({
        ...referentielSansVersion,
        versions: [{ ...versionCourante, document: '/fichiers/referentiel.pdf' }],
        version_courante: versionCourante.id,
      }).success,
    ).toBe(false);
  });
});
