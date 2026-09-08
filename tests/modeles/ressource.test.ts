import { describe, expect, it } from 'vitest';

import { schemaRessource } from '../../src/modeles/ressource';

const champsCommuns = {
  titre: 'Une ressource PPC',
  type: 'publication' as const,
  origine: 'ppc' as const,
  resume: 'Présentation de la ressource.',
  publie: false,
};

describe('schemaRessource', () => {
  it('accepte un lien direct externe', () => {
    expect(
      schemaRessource.safeParse({
        ...champsCommuns,
        mode_exposition: 'lien-direct',
        destination_directe: 'https://example.org/ressource',
      }).success,
    ).toBe(true);
  });

  it('accepte un lien direct vers un document public local', () => {
    expect(
      schemaRessource.safeParse({
        ...champsCommuns,
        mode_exposition: 'lien-direct',
        destination_directe: '/documents/ressources/livre-blanc.pdf',
      }).success,
    ).toBe(true);
  });

  it('refuse un lien direct sans destination', () => {
    expect(schemaRessource.safeParse({ ...champsCommuns, mode_exposition: 'lien-direct' }).success).toBe(false);
  });

  it('refuse un lien direct avec un slug', () => {
    expect(
      schemaRessource.safeParse({
        ...champsCommuns,
        mode_exposition: 'lien-direct',
        destination_directe: 'https://example.org/ressource',
        slug: 'ressource-interdite',
      }).success,
    ).toBe(false);
  });

  it('refuse un lien direct avec un lien principal associé', () => {
    expect(
      schemaRessource.safeParse({
        ...champsCommuns,
        mode_exposition: 'lien-direct',
        destination_directe: 'https://example.org/ressource',
        lien_principal_associe: 'https://example.org/source',
      }).success,
    ).toBe(false);
  });

  it('accepte une page interne avec un slug', () => {
    expect(
      schemaRessource.safeParse({
        ...champsCommuns,
        mode_exposition: 'page-interne',
        slug: 'une-ressource-ppc',
      }).success,
    ).toBe(true);
  });

  it('refuse une page interne sans slug', () => {
    expect(schemaRessource.safeParse({ ...champsCommuns, mode_exposition: 'page-interne' }).success).toBe(false);
  });

  it('refuse une page interne avec une destination directe', () => {
    expect(
      schemaRessource.safeParse({
        ...champsCommuns,
        mode_exposition: 'page-interne',
        slug: 'une-ressource-ppc',
        destination_directe: 'https://example.org/ressource',
      }).success,
    ).toBe(false);
  });

  it.each([
    { type: 'type-inconnu' },
    { origine: 'origine-inconnue' },
  ])('refuse une valeur contrôlée inconnue', (valeurInconnue) => {
    expect(
      schemaRessource.safeParse({
        ...champsCommuns,
        ...valeurInconnue,
        mode_exposition: 'page-interne',
        slug: 'une-ressource-ppc',
      }).success,
    ).toBe(false);
  });

  it('refuse un texte alternatif sans image', () => {
    expect(
      schemaRessource.safeParse({
        ...champsCommuns,
        mode_exposition: 'page-interne',
        slug: 'une-ressource-ppc',
        image_alt: 'Description',
      }).success,
    ).toBe(false);
  });
});
