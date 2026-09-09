import { z } from 'zod';

import { schemaTexteObligatoire, schemaUrlHttp } from './primitives.ts';

export const rolesPpcOrganisation = ['partenaire', 'mecene'] as const;

export const schemaRolePpcOrganisation = z.enum(rolesPpcOrganisation);

export function creerSchemaOrganisation<TLogo extends z.ZodType>(schemaLogo: TLogo) {
  return z
    .object({
      nom: schemaTexteObligatoire,
      site_web: schemaUrlHttp.optional(),
      logo: schemaLogo.optional(),
      description_courte: z.string().optional(),
      roles_ppc: z.array(schemaRolePpcOrganisation).optional(),
    })
    .strict();
}

export const schemaOrganisation = creerSchemaOrganisation(schemaTexteObligatoire);

export type Organisation = z.infer<typeof schemaOrganisation>;
