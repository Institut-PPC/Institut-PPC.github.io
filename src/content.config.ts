import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { creerSchemaActualite } from './modeles/actualite';
import { creerSchemaEvenement } from './modeles/evenement';
import { creerSchemaOrganisation } from './modeles/organisation';
import { creerSchemaPersonne } from './modeles/personne';
import { creerSchemaRessource } from './modeles/ressource';
import { schemaReferentiel } from './modeles/referentiel';
import { schemaAccueil } from './modeles/accueil';
import { schemaConfigurationSite } from './modeles/configuration-site';
import { schemaPageEditoriale } from './modeles/page-editoriale';

const actualites = defineCollection({
  loader: glob({
    base: './contenu/actualites',
    pattern: '*.md',
  }),
  schema: ({ image }) => creerSchemaActualite(image()),
});

const evenements = defineCollection({
  loader: glob({
    base: './contenu/evenements',
    pattern: '*.md',
  }),
  schema: ({ image }) => creerSchemaEvenement(image()),
});

const personnes = defineCollection({
  loader: glob({
    base: './contenu/personnes',
    pattern: '*.yaml',
  }),
  schema: ({ image }) => creerSchemaPersonne(image()),
});

const organisations = defineCollection({
  loader: glob({
    base: './contenu/organisations',
    pattern: '*.yaml',
  }),
  schema: ({ image }) => creerSchemaOrganisation(image()),
});

const ressources = defineCollection({
  loader: glob({
    base: './contenu/ressources',
    pattern: '*.md',
  }),
  schema: ({ image }) => creerSchemaRessource(image()),
});

const referentiels = defineCollection({
  loader: glob({
    base: './contenu/referentiels',
    pattern: '*.md',
  }),
  schema: schemaReferentiel,
});

const pages = defineCollection({
  loader: glob({
    base: './contenu/pages',
    pattern: '*.md',
  }),
  schema: schemaPageEditoriale,
});

const accueil = defineCollection({
  loader: glob({
    base: './contenu/pages',
    pattern: 'accueil.yaml',
  }),
  schema: schemaAccueil,
});

const configurationSite = defineCollection({
  loader: glob({
    base: './contenu/configuration',
    pattern: 'site.yaml',
  }),
  schema: schemaConfigurationSite,
});

export const collections = {
  actualites,
  evenements,
  personnes,
  organisations,
  ressources,
  referentiels,
  pages,
  accueil,
  configurationSite,
};
