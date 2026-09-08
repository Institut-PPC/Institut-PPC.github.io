import { z } from 'zod';

import {
  schemaDateHeure,
  schemaIdentifiantPpc,
  schemaSlug,
  schemaTexteObligatoire,
  schemaUrlHttp,
  verifierAlternativeImage,
} from './primitives.ts';

export const relationsPpcEvenement = ['organise-par-ppc', 'evenement-externe'] as const;

export const schemaRelationPpcEvenement = z.enum(relationsPpcEvenement);

export function creerSchemaEvenement<TImage extends z.ZodType>(schemaImage: TImage) {
  return z
    .object({
      titre: schemaTexteObligatoire,
      slug: schemaSlug,
      resume: schemaTexteObligatoire,
      date_debut: schemaDateHeure,
      date_fin: schemaDateHeure.optional(),
      relation_ppc: schemaRelationPpcEvenement,
      lieu: z.string().optional(),
      lien_externe: schemaUrlHttp.optional(),
      image: schemaImage.optional(),
      image_alt: z.string().optional(),
      organisations_liees: z.array(schemaIdentifiantPpc).optional(),
      personnes_liees: z.array(schemaIdentifiantPpc).optional(),
      publie: z.boolean(),
    })
    .strict()
    .superRefine((evenement, contexte) => {
      verifierAlternativeImage(evenement.image, evenement.image_alt, contexte);
    });
}

export const schemaEvenement = creerSchemaEvenement(schemaTexteObligatoire);

export type Evenement = z.infer<typeof schemaEvenement>;
