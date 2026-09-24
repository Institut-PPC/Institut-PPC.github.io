import { z } from 'zod';

import { schemaParagraphes, schemaTexteObligatoire, schemaUrlHttp } from './primitives.ts';

const schemaBasePage = z.object({
  titre: schemaTexteObligatoire,
  description: schemaTexteObligatoire.optional(),
  surtitre: schemaTexteObligatoire,
  introduction: schemaParagraphes,
});

const schemaSectionNarrative = z
  .object({
    surtitre: schemaTexteObligatoire,
    titre: schemaTexteObligatoire,
    paragraphes: schemaParagraphes,
  })
  .strict();

const schemaLienEditorial = z
  .object({
    titre: schemaTexteObligatoire,
    texte: schemaParagraphes,
  })
  .strict();

const schemaPilierPpc = z
  .object({
    numero: schemaTexteObligatoire,
    titre: schemaTexteObligatoire,
    intitule_technique: schemaTexteObligatoire,
    texte: schemaParagraphes,
  })
  .strict();

export const schemaPageComprendre = schemaBasePage
  .extend({
    sections: z.tuple([
      schemaSectionNarrative,
      schemaSectionNarrative,
      schemaSectionNarrative,
      schemaSectionNarrative,
      schemaSectionNarrative,
      schemaSectionNarrative,
    ]),
    piliers: z
      .object({
        elements: z.tuple([schemaPilierPpc, schemaPilierPpc, schemaPilierPpc, schemaPilierPpc]),
      })
      .strict(),
    poursuivre: z
      .object({
        surtitre: schemaTexteObligatoire,
        titre: schemaTexteObligatoire,
        texte: schemaParagraphes,
      })
      .strict(),
  })
  .strict();

export const schemaPageMarqueCollective = schemaBasePage
  .extend({
    sections: z.tuple([schemaSectionNarrative, schemaSectionNarrative]),
    appel: z
      .object({ titre: schemaTexteObligatoire, texte: schemaParagraphes })
      .strict(),
  })
  .strict();

export const schemaPageReferentiels = schemaBasePage
  .extend({
    etat_vide: z
      .object({
        titre: schemaTexteObligatoire,
        message: schemaTexteObligatoire,
      })
      .strict(),
  })
  .strict();

export const schemaPageAssociation = schemaBasePage
  .extend({
    mission: z
      .object({ surtitre: schemaTexteObligatoire, titre: schemaTexteObligatoire, texte: schemaParagraphes })
      .strict(),
    titre_liens: schemaTexteObligatoire,
    liens: z.tuple([schemaLienEditorial, schemaLienEditorial, schemaLienEditorial]),
    contact: z
      .object({ titre: schemaTexteObligatoire, texte: schemaParagraphes })
      .strict(),
  })
  .strict();

export const schemaPageGouvernance = schemaBasePage
  .extend({
    copresidence: z
      .object({
        titre: schemaTexteObligatoire,
        texte: schemaParagraphes,
        titre_vide: schemaTexteObligatoire,
        message_vide: schemaTexteObligatoire,
      })
      .strict(),
    conseil_administration: z
      .object({
        titre: schemaTexteObligatoire,
        texte: schemaParagraphes,
        titre_vide: schemaTexteObligatoire,
        message_vide: schemaTexteObligatoire,
      })
      .strict(),
    equipe_operationnelle: z
      .object({
        titre: schemaTexteObligatoire,
        texte: schemaParagraphes,
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
        texte: schemaParagraphes,
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
    texte: schemaParagraphes,
  })
  .strict();

export const schemaPageNousSoutenir = schemaBasePage
  .extend({
    manieres: z.tuple([schemaManiereSoutenir, schemaManiereSoutenir, schemaManiereSoutenir]),
  })
  .strict();

const schemaUrlHelloAsso = schemaUrlHttp.refine((valeur) => {
  const url = new URL(valeur);
  return url.protocol === 'https:' && (url.hostname === 'helloasso.com' || url.hostname.endsWith('.helloasso.com'));
}, 'L’URL doit utiliser HTTPS et appartenir à HelloAsso.');

const schemaPeriodeAdhesion = z
  .object({
    libelle_onglet: schemaTexteObligatoire,
    titre: schemaTexteObligatoire,
    description: schemaTexteObligatoire,
    url_widget: schemaUrlHelloAsso.optional(),
    url_directe: schemaUrlHelloAsso.optional(),
  })
  .strict()
  .superRefine((periode, contexte) => {
    if (Boolean(periode.url_widget) === Boolean(periode.url_directe)) return;
    contexte.addIssue({
      code: 'custom',
      message: 'url_widget et url_directe doivent être renseignées ensemble.',
    });
  });

export const schemaPageAdherer = schemaBasePage
  .extend({
    qui_peut_adherer: z
      .object({ titre: schemaTexteObligatoire, texte: schemaParagraphes })
      .strict(),
    pourquoi_adherer: z
      .object({
        titre: schemaTexteObligatoire,
        raisons: z.tuple([schemaTexteObligatoire, schemaTexteObligatoire, schemaTexteObligatoire]),
      })
      .strict(),
    choisir_adhesion: z
      .object({
        titre: schemaTexteObligatoire,
        introduction: schemaParagraphes,
        periodes: z.array(schemaPeriodeAdhesion).min(1),
      })
      .strict(),
  })
  .strict();

export const schemaPageFaireUnDon = schemaBasePage
  .extend({
    utilisation_dons: z
      .object({
        titre: schemaTexteObligatoire,
        raisons: z.tuple([schemaTexteObligatoire, schemaTexteObligatoire, schemaTexteObligatoire]),
        precision: schemaParagraphes,
      })
      .strict(),
    formulaire: z
      .object({
        titre: schemaTexteObligatoire,
        url_widget: schemaUrlHelloAsso,
        url_directe: schemaUrlHelloAsso,
      })
      .strict(),
  })
  .strict();

export const schemaPageTravaillerAvecNous = schemaBasePage
  .extend({
    collaboration: schemaSectionNarrative,
    preparation: z
      .object({
        titre: schemaTexteObligatoire,
        introduction: schemaParagraphes,
        informations: z.array(schemaTexteObligatoire).min(1),
      })
      .strict(),
    titre_liens: schemaTexteObligatoire,
  })
  .strict();

const schemaDemandeContact = z
  .object({ titre: schemaTexteObligatoire, texte: schemaParagraphes })
  .strict();

export const schemaPageContact = schemaBasePage
  .extend({
    coordonnees_absentes: z
      .object({ titre: schemaTexteObligatoire, texte: schemaParagraphes })
      .strict(),
    titre_demandes: schemaTexteObligatoire,
    demandes: z.array(schemaDemandeContact).min(1),
  })
  .strict();

export const schemaPageEcoConception = schemaBasePage
  .extend({
    introduction_detaillee: schemaParagraphes,
    enjeu: z
      .object({
        surtitre: schemaTexteObligatoire,
        titre: schemaTexteObligatoire,
        chiffres: z.tuple([
          schemaTexteObligatoire,
          schemaTexteObligatoire,
          schemaTexteObligatoire,
          schemaTexteObligatoire,
          schemaTexteObligatoire,
          schemaTexteObligatoire,
          schemaTexteObligatoire,
        ]),
        poids_pages: z.tuple([
          schemaTexteObligatoire,
          schemaTexteObligatoire,
          schemaTexteObligatoire,
          schemaTexteObligatoire,
          schemaTexteObligatoire,
        ]),
        citation: schemaTexteObligatoire,
        sources: z.array(
          z
            .object({
              libelle: schemaTexteObligatoire,
              url: schemaUrlHttp,
            })
            .strict(),
        ).min(1),
      })
      .strict(),
    conception: z
      .object({
        surtitre: schemaTexteObligatoire,
        titre: schemaTexteObligatoire,
        choix: z.array(schemaLienEditorial).min(1),
        conclusion: schemaParagraphes,
      })
      .strict(),
    mesure: z
      .object({
        surtitre: schemaTexteObligatoire,
        titre: schemaTexteObligatoire,
        introduction: schemaParagraphes,
        score: z.number().int().min(0).max(100),
        url_resultat: schemaUrlHttp,
        texte_lien: schemaTexteObligatoire,
        suivi: schemaParagraphes,
      })
      .strict(),
  })
  .strict();

export const schemaPageMarkdown = schemaBasePage.strict();

export const schemaPageEditoriale = z.union([
  schemaPageComprendre,
  schemaPageMarqueCollective,
  schemaPageReferentiels,
  schemaPageAssociation,
  schemaPageGouvernance,
  schemaPageMembresFondateurs,
  schemaPageNousSoutenir,
  schemaPageAdherer,
  schemaPageFaireUnDon,
  schemaPageTravaillerAvecNous,
  schemaPageContact,
  schemaPageEcoConception,
  schemaPageMarkdown,
]);
