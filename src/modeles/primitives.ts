import { z } from 'zod';

const motifIdentifiantPpc = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const schemaTexteObligatoire = z.string().trim().min(1, 'Ce champ ne peut pas être vide.');

export const schemaIdentifiantPpc = z
  .string()
  .regex(motifIdentifiantPpc, 'L’identifiant doit être en ASCII minuscule et en kebab-case.');

export const schemaSlug = z
  .string()
  .regex(motifIdentifiantPpc, 'Le slug doit être en ASCII minuscule et en kebab-case.');

export const schemaUrlHttp = z.url({ protocol: /^https?$/ });

export const schemaCheminDocumentPublic = z
  .string()
  .regex(/^\/documents\/[^?#\s]+$/, 'Le document local doit être un chemin sous /documents/.')
  .refine(
    (chemin) => !chemin.split('/').some((segment) => segment === '.' || segment === '..'),
    'Le chemin du document local ne peut pas contenir de segment relatif.',
  );

export const schemaDestinationWebOuDocument = z.union([schemaUrlHttp, schemaCheminDocumentPublic]);

export const schemaDate = z
  .union([z.iso.date(), z.date()])
  .transform((date) => (date instanceof Date ? date.toISOString().slice(0, 10) : date));

export const schemaDateHeure = z
  .union([z.iso.datetime({ offset: true }), z.date()])
  .transform((date) => (date instanceof Date ? date.toISOString() : date));

export function verifierAlternativeImage(
  image: unknown,
  imageAlt: string | undefined,
  contexte: z.RefinementCtx,
) {
  if (image === undefined && imageAlt !== undefined) {
    contexte.addIssue({
      code: 'custom',
      path: ['image_alt'],
      message: 'Un texte alternatif ne peut pas être défini sans image associée.',
    });
  }
}
