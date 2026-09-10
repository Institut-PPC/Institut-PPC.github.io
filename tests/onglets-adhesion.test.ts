import { describe, expect, it } from 'vitest';

import { indexOngletCible } from '../src/components/onglets-adhesion';

describe('navigation clavier des onglets d’adhésion', () => {
  it('circule avec les flèches, y compris aux extrémités', () => {
    expect(indexOngletCible('ArrowRight', 0, 2)).toBe(1);
    expect(indexOngletCible('ArrowRight', 1, 2)).toBe(0);
    expect(indexOngletCible('ArrowLeft', 0, 2)).toBe(1);
  });

  it('rejoint le premier ou le dernier onglet avec Home et End', () => {
    expect(indexOngletCible('Home', 1, 2)).toBe(0);
    expect(indexOngletCible('End', 0, 2)).toBe(1);
  });

  it('ignore les touches étrangères à la navigation des onglets', () => {
    expect(indexOngletCible('Tab', 0, 2)).toBeUndefined();
  });
});
