import { z } from 'zod';

import { schemaDate, schemaSlug, schemaTexteObligatoire, verifierAlternativeImage } from './primitives';

export function creerSchemaActualite<TImage extends z.ZodType>(schemaImage: TImage) {
  return z
    .object({
      titre: schemaTexteObligatoire,
      slug: schemaSlug,
      resume: schemaTexteObligatoire,
      date_publication: schemaDate,
      date_mise_a_jour: schemaDate.optional(),
      image_principale: schemaImage.optional(),
      image_alt: z.string().optional(),
      publie: z.boolean(),
    })
    .strict()
    .superRefine((actualite, contexte) => {
      verifierAlternativeImage(actualite.image_principale, actualite.image_alt, contexte);
    });
}

export const schemaActualite = creerSchemaActualite(schemaTexteObligatoire);

export type Actualite = z.infer<typeof schemaActualite>;
