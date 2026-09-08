import { z } from 'zod';

import { schemaTexteObligatoire, schemaUrlHttp } from './primitives';

const schemaIdentiteSite = z
  .object({
    nom_court: schemaTexteObligatoire,
    nom_complet: schemaTexteObligatoire,
    nom_association: schemaTexteObligatoire,
  })
  .strict();

const schemaReseauSocial = z
  .object({
    nom: schemaTexteObligatoire,
    url: schemaUrlHttp,
  })
  .strict();

export const schemaConfigurationSite = z
  .object({
    identite: schemaIdentiteSite,
    adresse_postale: z.array(schemaTexteObligatoire).min(1).optional(),
    email_public: z.email().optional(),
    reseaux_sociaux: z.array(schemaReseauSocial).optional(),
    url_adhesion: schemaUrlHttp.optional(),
    url_don: schemaUrlHttp.optional(),
    url_newsletter: schemaUrlHttp.optional(),
  })
  .strict();

export type ConfigurationSite = z.infer<typeof schemaConfigurationSite>;
