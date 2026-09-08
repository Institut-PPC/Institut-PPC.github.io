import { describe, expect, it } from 'vitest';

import { schemaConfigurationSite } from '../../src/modeles/configuration-site';

const identite = {
  nom_court: 'PPC',
  nom_complet: 'Pérennité Programmée Circulaire',
  nom_association: 'Association pour la Pérennité Programmée Circulaire',
};

describe('schemaConfigurationSite', () => {
  it('accepte une configuration sans coordonnées encore validées', () => {
    expect(schemaConfigurationSite.safeParse({ identite }).success).toBe(true);
  });

  it('refuse les destinations globales qui ne sont pas des URL HTTP(S)', () => {
    expect(
      schemaConfigurationSite.safeParse({ identite, url_adhesion: 'service-adhesion' }).success,
    ).toBe(false);
  });
});
