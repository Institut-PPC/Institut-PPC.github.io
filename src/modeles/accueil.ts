import { z } from 'zod';

import { schemaIdentifiantPpc, schemaTexteObligatoire } from './primitives.ts';

const schemaEnteteSection = z
  .object({
    surtitre: schemaTexteObligatoire,
    titre: schemaTexteObligatoire,
    introduction: schemaTexteObligatoire.optional(),
  })
  .strict();

const schemaPrincipeAccueil = z
  .object({
    numero: schemaTexteObligatoire,
    titre: schemaTexteObligatoire,
    texte: schemaTexteObligatoire,
  })
  .strict();

export const schemaAccueil = z
  .object({
    titre_page: schemaTexteObligatoire,
    description: schemaTexteObligatoire,
    hero: z
      .object({
        surtitre: schemaTexteObligatoire,
        titre_lignes: z.tuple([
          schemaTexteObligatoire,
          schemaTexteObligatoire,
          schemaTexteObligatoire,
        ]),
        introduction: schemaTexteObligatoire,
      })
      .strict(),
    pourquoi: schemaEnteteSection.extend({
      principes: z.tuple([schemaPrincipeAccueil, schemaPrincipeAccueil, schemaPrincipeAccueil]),
    }),
    cadre_concret: schemaEnteteSection.extend({ texte: schemaTexteObligatoire }),
    contribuer: schemaEnteteSection,
    approfondir: schemaEnteteSection,
    ressources_mises_en_avant: z.array(schemaIdentifiantPpc),
    mouvement: schemaEnteteSection,
    association: schemaEnteteSection.extend({ texte: schemaTexteObligatoire }),
  })
  .strict();

export type Accueil = z.infer<typeof schemaAccueil>;
