import { z } from 'zod';

import { schemaIdentifiantPpc, schemaParagraphes, schemaTexteObligatoire } from './primitives.ts';

const schemaEnteteSection = z
  .object({
    surtitre: schemaTexteObligatoire,
    titre: schemaTexteObligatoire,
    introduction: schemaParagraphes.optional(),
  })
  .strict();

const schemaPrincipeAccueil = z
  .object({
    numero: schemaTexteObligatoire,
    titre: schemaTexteObligatoire,
    texte: schemaTexteObligatoire,
  })
  .strict();

const schemaPilierAccueil = z
  .object({
    numero: schemaTexteObligatoire,
    titre: schemaTexteObligatoire,
    description: schemaParagraphes,
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
        introduction: schemaParagraphes,
      })
      .strict(),
    pourquoi: schemaEnteteSection.extend({
      principes: z.tuple([schemaPrincipeAccueil, schemaPrincipeAccueil, schemaPrincipeAccueil]),
    }),
    idee_ppc: schemaEnteteSection.extend({
      texte_principal: schemaParagraphes,
      texte_complementaire: schemaParagraphes,
      piliers: z
        .object({
          titre: schemaTexteObligatoire,
          items: z.tuple([
            schemaPilierAccueil,
            schemaPilierAccueil,
            schemaPilierAccueil,
            schemaPilierAccueil,
          ]),
        })
        .strict(),
    }),
    cadre_concret: schemaEnteteSection.extend({ texte: schemaParagraphes }),
    contribuer: schemaEnteteSection,
    approfondir: schemaEnteteSection,
    ressources_mises_en_avant: z.array(schemaIdentifiantPpc),
    mouvement: schemaEnteteSection,
    association: schemaEnteteSection.extend({ texte: schemaParagraphes }),
  })
  .strict();

export type Accueil = z.infer<typeof schemaAccueil>;
