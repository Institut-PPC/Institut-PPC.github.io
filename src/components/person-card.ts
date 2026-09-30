interface RolesPersonCard {
  role?: string;
  roles?: readonly string[];
}

export function normaliserRolesPersonCard({ role, roles }: RolesPersonCard): readonly string[] {
  return roles ?? (role ? [role] : []);
}
