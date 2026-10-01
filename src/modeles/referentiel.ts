import { z } from 'zod';

import {
  schemaDate,
  schemaIdentifiantPpc,
  schemaParagraphes,
  schemaTexteObligatoire,
} from './primitives.ts';

export const schemaNumeroVersionReferentiel = z
  .string()
  .regex(/^\d+\.\d+(?:\.\d+)?$/, 'La version doit utiliser un format numérique comme 1.0 ou 1.2.3.');

export const schemaDocumentReferentiel = z
  .string()
  .regex(
    /^\/documents\/referentiels\/[a-z0-9]+(?:-[a-z0-9]+)*\/[^/?#\s]+\.pdf$/,
    'Le PDF doit être un chemin local sous /documents/referentiels/<identifiant>/.',
  );

export const schemaVersionReferentiel = z
  .object({
    id: schemaIdentifiantPpc,
    version: schemaNumeroVersionReferentiel,
    date_publication: schemaDate,
    document: schemaDocumentReferentiel,
  })
  .strict();

export const schemaSectionPreambuleReferentiel = z
  .object({
    titre: schemaTexteObligatoire,
    paragraphes: schemaParagraphes,
  })
  .strict();

export const schemaReferentiel = z
  .object({
    titre: schemaTexteObligatoire,
    resume: schemaTexteObligatoire,
    statut_public: schemaTexteObligatoire.optional(),
    preambule: z.array(schemaSectionPreambuleReferentiel).min(1),
    version_courante: schemaIdentifiantPpc,
    versions: z.array(schemaVersionReferentiel).min(1),
    publie: z.boolean(),
  })
  .strict()
  .superRefine((referentiel, contexte) => {
    const idsVus = new Set<string>();

    referentiel.versions.forEach((version, index) => {
      if (idsVus.has(version.id)) {
        contexte.addIssue({
          code: 'custom',
          path: ['versions', index, 'id'],
          message: 'Chaque version doit posséder un identifiant unique dans ce référentiel.',
        });
      }

      idsVus.add(version.id);
    });

    if (!idsVus.has(referentiel.version_courante)) {
      contexte.addIssue({
        code: 'custom',
        path: ['version_courante'],
        message: 'La version courante doit correspondre à l’identifiant d’une version du référentiel.',
      });
    }
  });

export type Referentiel = z.infer<typeof schemaReferentiel>;
