import { describe, expect, it } from 'vitest';

import { evenementAVenir } from '../src/lib/contenus';

describe('statut temporel d’un événement', () => {
  const maintenant = new Date('2026-09-08T12:00:00+02:00');

  it('considère comme à venir un événement dont le début est futur', () => {
    expect(evenementAVenir(undefined, '2026-09-09T09:00:00+02:00', maintenant)).toBe(true);
  });

  it('conserve comme à venir un événement commencé mais pas terminé', () => {
    expect(
      evenementAVenir('2026-09-08T18:00:00+02:00', '2026-09-08T09:00:00+02:00', maintenant),
    ).toBe(true);
  });

  it('considère comme passé un événement terminé', () => {
    expect(
      evenementAVenir('2026-09-08T11:00:00+02:00', '2026-09-08T09:00:00+02:00', maintenant),
    ).toBe(false);
  });
});
