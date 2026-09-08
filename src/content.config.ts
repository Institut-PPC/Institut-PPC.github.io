import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { creerSchemaPersonne } from './modeles/personne';

const personnes = defineCollection({
  loader: glob({
    base: './contenu/personnes',
    pattern: '*.yaml',
  }),
  schema: ({ image }) => creerSchemaPersonne(image()),
});

export const collections = { personnes };
