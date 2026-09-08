import { z } from 'zod';

import {
  schemaDate,
  schemaDestinationWebOuDocument,
  schemaIdentifiantPpc,
  schemaSlug,
  schemaTexteObligatoire,
} from './primitives.ts';

export const schemaVersionReferentiel = z
  .object({
    id: schemaIdentifiantPpc,
    version: schemaTexteObligatoire,
    date_publication: schemaDate.optional(),
    document: schemaDestinationWebOuDocument.optional(),
  })
  .strict();

export const schemaReferentiel = z
  .object({
    titre: schemaTexteObligatoire,
    slug: schemaSlug.optional(),
    resume: schemaTexteObligatoire,
    statut_public: schemaTexteObligatoire.optional(),
    version_courante: schemaIdentifiantPpc.optional(),
    versions: z.array(schemaVersionReferentiel),
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

    if (referentiel.versions.length > 0 && referentiel.version_courante === undefined) {
      contexte.addIssue({
        code: 'custom',
        path: ['version_courante'],
        message: 'La version courante est obligatoire lorsqu’au moins une version existe.',
      });
    }

    if (referentiel.version_courante !== undefined && !idsVus.has(referentiel.version_courante)) {
      contexte.addIssue({
        code: 'custom',
        path: ['version_courante'],
        message: 'La version courante doit correspondre à l’identifiant d’une version du référentiel.',
      });
    }
  });

export type Referentiel = z.infer<typeof schemaReferentiel>;
