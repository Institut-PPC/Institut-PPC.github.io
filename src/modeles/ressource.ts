import { z } from 'zod';

import {
  schemaDate,
  schemaDestinationWebOuDocument,
  schemaSlug,
  schemaTexteObligatoire,
  verifierAlternativeImage,
} from './primitives.ts';

export const typesRessource = ['video', 'ouvrage', 'publication', 'formation', 'travail-ppc', 'autre'] as const;
export const originesRessource = ['ppc', 'externe'] as const;
export const modesExpositionRessource = ['lien-direct', 'page-interne'] as const;

export const schemaTypeRessource = z.enum(typesRessource);
export const schemaOrigineRessource = z.enum(originesRessource);

export function creerSchemaRessource<TImage extends z.ZodType>(schemaImage: TImage) {
  const champsCommuns = {
    titre: schemaTexteObligatoire,
    type: schemaTypeRessource,
    origine: schemaOrigineRessource,
    resume: schemaTexteObligatoire,
    image: schemaImage.optional(),
    image_alt: z.string().optional(),
    date: schemaDate.optional(),
    publie: z.boolean(),
  };

  return z
    .discriminatedUnion('mode_exposition', [
      z
        .object({
          ...champsCommuns,
          mode_exposition: z.literal(modesExpositionRessource[0]),
          destination_directe: schemaDestinationWebOuDocument,
        })
        .strict(),
      z
        .object({
          ...champsCommuns,
          mode_exposition: z.literal(modesExpositionRessource[1]),
          slug: schemaSlug,
          lien_principal_associe: schemaDestinationWebOuDocument.optional(),
        })
        .strict(),
    ])
    .superRefine((ressource, contexte) => {
      verifierAlternativeImage(ressource.image, ressource.image_alt, contexte);
    });
}

export const schemaRessource = creerSchemaRessource(schemaTexteObligatoire);

export type Ressource = z.infer<typeof schemaRessource>;
