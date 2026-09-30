import type { RolePpc } from './personne';

const libellesRolesComplementaires = new Map<RolePpc, string>([
  ['conseil-administration-representant-vivant', 'Représentation du vivant'],
  ['co-tresorier', 'Co-trésorerie'],
]);

export function obtenirRolesComplementaires(roles: readonly RolePpc[] | undefined): string[] {
  return roles?.flatMap((role) => {
    const libelle = libellesRolesComplementaires.get(role);
    return libelle ? [libelle] : [];
  }) ?? [];
}
