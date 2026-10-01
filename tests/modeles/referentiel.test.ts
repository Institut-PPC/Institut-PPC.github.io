import { describe, expect, it } from 'vitest';

import { schemaReferentiel } from '../../src/modeles/referentiel';

const versionCourante = {
  id: 'v1-0',
  version: '1.0',
  date_publication: '2026-09-29',
  document: '/documents/referentiels/referentiel-ppc/2026-09-29_Referentiel-PPC_v1.0.pdf',
};

const referentielValide = {
  titre: 'Référentiel PPC',
  resume: 'Présentation du référentiel.',
  preambule: [{ titre: 'Objet', paragraphes: ['Présentation officielle.'] }],
  versions: [versionCourante],
  version_courante: versionCourante.id,
  publie: true,
};

describe('schemaReferentiel', () => {
  it('accepte un référentiel courant complet', () => {
    expect(schemaReferentiel.safeParse(referentielValide).success).toBe(true);
  });

  it('refuse un frontmatter sans préambule, version ou PDF', () => {
    expect(schemaReferentiel.safeParse({ titre: 'Référentiel PPC', resume: 'Résumé.', publie: true }).success).toBe(false);
  });

  it('refuse une version courante inconnue', () => {
    expect(schemaReferentiel.safeParse({ ...referentielValide, version_courante: 'v2-0' }).success).toBe(false);
  });

  it('refuse un doublon d’identifiant de version', () => {
    expect(schemaReferentiel.safeParse({
      ...referentielValide,
      versions: [versionCourante, { ...versionCourante, version: '1.1' }],
    }).success).toBe(false);
  });

  it.each(['1', 'v1.0', 'version-1', '1.0-beta'])('refuse le numéro de version invalide %s', (version) => {
    expect(schemaReferentiel.safeParse({
      ...referentielValide,
      versions: [{ ...versionCourante, version }],
    }).success).toBe(false);
  });

  it('refuse une date absente ou invalide', () => {
    const { date_publication: _date, ...sansDate } = versionCourante;
    expect(schemaReferentiel.safeParse({ ...referentielValide, versions: [sansDate] }).success).toBe(false);
    expect(schemaReferentiel.safeParse({
      ...referentielValide,
      versions: [{ ...versionCourante, date_publication: '2026-02-30' }],
    }).success).toBe(false);
  });

  it('refuse un document externe ou hors du dossier des référentiels', () => {
    for (const document of ['https://example.org/referentiel.pdf', '/documents/referentiel.pdf']) {
      expect(schemaReferentiel.safeParse({
        ...referentielValide,
        versions: [{ ...versionCourante, document }],
      }).success).toBe(false);
    }
  });
});
