import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { creerSchemaActualite } from './modeles/actualite';
import { creerSchemaEvenement } from './modeles/evenement';
import { creerSchemaPersonne } from './modeles/personne';
import { creerSchemaRessource } from './modeles/ressource';
import { schemaReferentiel } from './modeles/referentiel';

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

export const collections = { actualites, evenements, personnes, ressources, referentiels };
