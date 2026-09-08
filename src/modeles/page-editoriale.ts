import { z } from 'zod';

import { schemaTexteObligatoire } from './primitives.ts';

const schemaBasePage = z.object({
  titre: schemaTexteObligatoire,
  description: schemaTexteObligatoire.optional(),
  surtitre: schemaTexteObligatoire,
  introduction: schemaTexteObligatoire,
});

const schemaSectionNarrative = z
  .object({
    surtitre: schemaTexteObligatoire,
    titre: schemaTexteObligatoire,
    paragraphes: z.array(schemaTexteObligatoire).min(1),
  })
  .strict();

const schemaLienEditorial = z
  .object({
    titre: schemaTexteObligatoire,
    texte: schemaTexteObligatoire,
  })
  .strict();

export const schemaPageComprendre = schemaBasePage
  .extend({
    sections: z.tuple([schemaSectionNarrative, schemaSectionNarrative, schemaSectionNarrative]),
    poursuivre: z
      .object({
        surtitre: schemaTexteObligatoire,
        titre: schemaTexteObligatoire,
        texte: schemaTexteObligatoire,
      })
      .strict(),
  })
  .strict();

export const schemaPageMarqueCollective = schemaBasePage
  .extend({
    sections: z.tuple([schemaSectionNarrative, schemaSectionNarrative]),
    appel: z
      .object({ titre: schemaTexteObligatoire, texte: schemaTexteObligatoire })
      .strict(),
  })
  .strict();

export const schemaPageAssociation = schemaBasePage
  .extend({
    mission: z
      .object({ surtitre: schemaTexteObligatoire, titre: schemaTexteObligatoire, texte: schemaTexteObligatoire })
      .strict(),
    titre_liens: schemaTexteObligatoire,
    liens: z.tuple([schemaLienEditorial, schemaLienEditorial, schemaLienEditorial]),
    contact: z
      .object({ titre: schemaTexteObligatoire, texte: schemaTexteObligatoire })
      .strict(),
  })
  .strict();

export const schemaPageGouvernance = schemaBasePage
  .extend({
    copresidence: z
      .object({
        titre: schemaTexteObligatoire,
        texte: schemaTexteObligatoire,
        titre_vide: schemaTexteObligatoire,
        message_vide: schemaTexteObligatoire,
      })
      .strict(),
    conseil_administration: z
      .object({
        titre: schemaTexteObligatoire,
        texte: schemaTexteObligatoire,
        titre_vide: schemaTexteObligatoire,
        message_vide: schemaTexteObligatoire,
      })
      .strict(),
  })
  .strict();

export const schemaPageMembresFondateurs = schemaBasePage
  .extend({
    presentation: z
      .object({
        titre: schemaTexteObligatoire,
        texte: schemaTexteObligatoire,
        titre_vide: schemaTexteObligatoire,
        message_vide: schemaTexteObligatoire,
      })
      .strict(),
  })
  .strict();

const schemaManiereSoutenir = z
  .object({
    numero: schemaTexteObligatoire,
    titre: schemaTexteObligatoire,
    texte: schemaTexteObligatoire,
  })
  .strict();

export const schemaPageNousSoutenir = schemaBasePage
  .extend({
    manieres: z.tuple([schemaManiereSoutenir, schemaManiereSoutenir, schemaManiereSoutenir]),
  })
  .strict();

export const schemaPageTravaillerAvecNous = schemaBasePage
  .extend({
    collaboration: schemaSectionNarrative,
    preparation: z
      .object({
        titre: schemaTexteObligatoire,
        introduction: schemaTexteObligatoire,
        informations: z.array(schemaTexteObligatoire).min(1),
      })
      .strict(),
    titre_liens: schemaTexteObligatoire,
  })
  .strict();

const schemaDemandeContact = z
  .object({ titre: schemaTexteObligatoire, texte: schemaTexteObligatoire })
  .strict();

export const schemaPageContact = schemaBasePage
  .extend({
    coordonnees_absentes: z
      .object({ titre: schemaTexteObligatoire, texte: schemaTexteObligatoire })
      .strict(),
    titre_demandes: schemaTexteObligatoire,
    demandes: z.array(schemaDemandeContact).min(1),
  })
  .strict();

export const schemaPageMarkdown = schemaBasePage.strict();

export const schemaPageEditoriale = z.union([
  schemaPageComprendre,
  schemaPageMarqueCollective,
  schemaPageAssociation,
  schemaPageGouvernance,
  schemaPageMembresFondateurs,
  schemaPageNousSoutenir,
  schemaPageTravaillerAvecNous,
  schemaPageContact,
  schemaPageMarkdown,
]);
