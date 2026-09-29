import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const DOMAINE_CANONIQUE = 'www.perennite-programmee-circulaire.org';
const REGLE_ATTENDUE = `/*  https://${DOMAINE_CANONIQUE}/:splat  301!`;

describe('service Netlify de redirection des domaines secondaires', () => {
  it('redirige chaque chemin de manière permanente vers le domaine canonique', async () => {
    const contenu = await readFile(
      new URL('../netlify/redirects/public/_redirects', import.meta.url),
      'utf8',
    );
    const regles = contenu
      .split('\n')
      .map((ligne) => ligne.trim())
      .filter(Boolean);

    expect(regles).toEqual([REGLE_ATTENDUE]);
  });

  it('ne configure ni Functions ni publication du site Astro', async () => {
    const configuration = await readFile(
      new URL('../netlify/redirects/netlify.toml', import.meta.url),
      'utf8',
    );

    expect(configuration).toContain('publish = "/netlify/redirects/public"');
    expect(configuration).not.toMatch(/^\s*\[functions\]/m);
    expect(configuration).not.toContain('dist');
    expect(configuration).not.toContain(DOMAINE_CANONIQUE);
  });
});
