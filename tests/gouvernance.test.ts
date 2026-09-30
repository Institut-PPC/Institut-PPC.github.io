import { describe, expect, it } from 'vitest';

import { normaliserRolesPersonCard } from '../src/components/person-card';
import { obtenirRolesComplementaires } from '../src/modeles/gouvernance';

describe('obtenirRolesComplementaires', () => {
  it('n’affiche pas les rôles principaux des blocs', () => {
    expect(obtenirRolesComplementaires(['co-presidence', 'conseil-administration', 'equipe-operationnelle'])).toEqual([]);
  });

  it('affiche la représentation du vivant et la co-trésorerie lorsqu’elles sont cumulées', () => {
    expect(
      obtenirRolesComplementaires([
        'conseil-administration',
        'conseil-administration-representant-vivant',
        'co-tresorier',
      ]),
    ).toEqual(['Représentation du vivant', 'Co-trésorerie']);
  });

  it('affiche la co-trésorerie dans une équipe opérationnelle sans répéter le bloc', () => {
    expect(obtenirRolesComplementaires(['equipe-operationnelle', 'co-tresorier'])).toEqual(['Co-trésorerie']);
  });
});

describe('normaliserRolesPersonCard', () => {
  it('gère zéro, un ou plusieurs libellés', () => {
    expect(normaliserRolesPersonCard({})).toEqual([]);
    expect(normaliserRolesPersonCard({ roles: ['Co-trésorerie'] })).toEqual(['Co-trésorerie']);
    expect(normaliserRolesPersonCard({ roles: ['Représentation du vivant', 'Co-trésorerie'] })).toEqual([
      'Représentation du vivant',
      'Co-trésorerie',
    ]);
  });

  it('préserve la propriété historique role', () => {
    expect(normaliserRolesPersonCard({ role: 'Co-trésorerie' })).toEqual(['Co-trésorerie']);
  });
});
