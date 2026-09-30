import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import { rolesPpc } from '../src/modeles/personne';

interface ChampDecap {
  name?: string;
  options?: Array<{ value: string }>;
}

interface CollectionDecap {
  name?: string;
  fields?: ChampDecap[];
}

describe('configuration Decap', () => {
  it('expose exactement le vocabulaire des rôles PPC du modèle Personne', () => {
    const configuration = parse(readFileSync('public/admin/config.yml', 'utf8')) as {
      collections: CollectionDecap[];
    };
    const personnes = configuration.collections.find((collection) => collection.name === 'personnes');
    const roles = personnes?.fields?.find((champ) => champ.name === 'roles_ppc');

    expect(roles?.options?.map(({ value }) => value)).toEqual([...rolesPpc]);
  });
});
