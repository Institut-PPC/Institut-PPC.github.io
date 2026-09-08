import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';
import { stringify } from 'yaml';

import { validerContenus } from '../src/validation/contenus.ts';

const racinesTemporaires: string[] = [];

const actualiteValide = {
  titre: 'Actualité PPC',
  slug: 'actualite-ppc',
  resume: 'Une actualité valide.',
  date_publication: '2026-09-08',
  publie: true,
};

const evenementValide = {
  titre: 'Événement PPC',
  slug: 'evenement-ppc',
  resume: 'Un événement valide.',
  date_debut: '2026-09-08T10:00:00+02:00',
  relation_ppc: 'organise-par-ppc',
  personnes_liees: ['alice-durand'],
  publie: true,
};

const ressourceValide = {
  titre: 'Ressource PPC',
  type: 'publication',
  origine: 'ppc',
  resume: 'Une ressource valide.',
  mode_exposition: 'lien-direct',
  destination_directe: '/documents/ressources/guide.pdf',
  publie: true,
};

const accueilValide = {
  titre_page: 'PPC',
  description: 'Présentation de PPC.',
  hero: { surtitre: 'Démarche', titre_lignes: ['Pérennité', 'Programmée', 'Circulaire'], introduction: 'Introduction.' },
  pourquoi: {
    surtitre: 'Pourquoi',
    titre: 'Comprendre',
    principes: [
      { numero: '01', titre: 'Principe 1', texte: 'Texte 1.' },
      { numero: '02', titre: 'Principe 2', texte: 'Texte 2.' },
      { numero: '03', titre: 'Principe 3', texte: 'Texte 3.' },
    ],
  },
  cadre_concret: { surtitre: 'Cadre', titre: 'Un cadre', texte: 'Texte.' },
  contribuer: { surtitre: 'Contribuer', titre: 'Contribuer' },
  approfondir: { surtitre: 'Approfondir', titre: 'Approfondir' },
  ressources_mises_en_avant: ['guide-ppc'],
  mouvement: { surtitre: 'Mouvement', titre: 'Mouvement' },
  association: { surtitre: 'Association', titre: 'Association', texte: 'Texte.' },
};

async function ecrire(racine: string, relatif: string, contenu: string | Uint8Array): Promise<void> {
  const destination = path.join(racine, relatif);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contenu);
}

async function ecrireMarkdown(racine: string, relatif: string, donnees: unknown, corps = ''): Promise<void> {
  await ecrire(racine, relatif, `---\n${stringify(donnees)}---\n${corps}`);
}

async function creerCorpusValide(): Promise<string> {
  const racine = await mkdtemp(path.join(tmpdir(), 'site-ppc-validation-'));
  racinesTemporaires.push(racine);
  for (const dossier of ['actualites', 'evenements', 'personnes', 'ressources', 'referentiels', 'pages', 'configuration']) {
    await mkdir(path.join(racine, 'contenu', dossier), { recursive: true });
  }

  await ecrireMarkdown(racine, 'contenu/actualites/2026-09-08-actualite-ppc.md', actualiteValide, 'Un contenu éditorial.\n');
  await ecrireMarkdown(racine, 'contenu/evenements/2026-09-08-evenement-ppc.md', evenementValide, 'Un contenu éditorial.\n');
  await ecrire(racine, 'contenu/personnes/alice-durand.yaml', stringify({ prenom: 'Alice', nom: 'Durand' }));
  await ecrireMarkdown(racine, 'contenu/ressources/guide-ppc.md', ressourceValide, '  \n\n');
  await ecrire(racine, 'public/documents/ressources/guide.pdf', 'document de test');
  await ecrire(racine, 'contenu/pages/accueil.yaml', stringify(accueilValide));
  await ecrire(racine, 'contenu/configuration/site.yaml', stringify({
    identite: { nom_court: 'PPC', nom_complet: 'Pérennité Programmée Circulaire', nom_association: 'Association PPC' },
  }));
  return racine;
}

afterEach(async () => {
  await Promise.all(racinesTemporaires.splice(0).map((racine) => rm(racine, { recursive: true, force: true })));
});

describe('validateur transverse des contenus', () => {
  it('accepte un corpus valide, dont un document local existant et un lien direct au corps vide', async () => {
    const rapport = await validerContenus(await creerCorpusValide());
    expect(rapport.erreurs).toEqual([]);
  });

  it('refuse un nom d’actualité qui ne respecte pas la convention datée', async () => {
    const racine = await creerCorpusValide();
    await ecrireMarkdown(racine, 'contenu/actualites/actualite-sans-date.md', { ...actualiteValide, slug: 'autre-actualite' }, 'Contenu.');
    const rapport = await validerContenus(racine);
    expect(rapport.erreurs.some((erreur) => erreur.chemin.endsWith('actualite-sans-date.md') && erreur.message.includes('YYYY-MM-DD'))).toBe(true);
  });

  it('signale les fichiers en conflit lorsqu’un slug est en doublon', async () => {
    const racine = await creerCorpusValide();
    await ecrireMarkdown(racine, 'contenu/actualites/2026-09-09-autre-actualite.md', actualiteValide, 'Contenu.');
    const rapport = await validerContenus(racine);
    const doublons = rapport.erreurs.filter((erreur) => erreur.message.includes('actualite-ppc') && erreur.message.includes('Fichiers en conflit'));
    expect(doublons).toHaveLength(2);
  });

  it('refuse une relation vers une Personne inexistante', async () => {
    const racine = await creerCorpusValide();
    await ecrireMarkdown(racine, 'contenu/evenements/2026-09-08-evenement-ppc.md', { ...evenementValide, personnes_liees: ['personne-absente'] }, 'Contenu.');
    const rapport = await validerContenus(racine);
    expect(rapport.erreurs.some((erreur) => erreur.message.includes('Personne inexistante « personne-absente »'))).toBe(true);
  });

  it('refuse un document public local manquant sans vérifier les URL externes', async () => {
    const racine = await creerCorpusValide();
    await ecrireMarkdown(racine, 'contenu/ressources/guide-ppc.md', { ...ressourceValide, destination_directe: '/documents/ressources/absent.pdf' });
    await ecrireMarkdown(racine, 'contenu/ressources/source-externe.md', { ...ressourceValide, destination_directe: 'https://example.org/document.pdf' });
    const rapport = await validerContenus(racine);
    expect(rapport.erreurs.some((erreur) => erreur.message.includes('/documents/ressources/absent.pdf'))).toBe(true);
    expect(rapport.erreurs.some((erreur) => erreur.message.includes('example.org'))).toBe(false);
  });

  it('refuse le corps éditorial non vide d’une Ressource en lien direct', async () => {
    const racine = await creerCorpusValide();
    await ecrireMarkdown(racine, 'contenu/ressources/guide-ppc.md', ressourceValide, 'Corps interdit.');
    const rapport = await validerContenus(racine);
    expect(rapport.erreurs.some((erreur) => erreur.message.includes('corps Markdown vide'))).toBe(true);
  });

  it('agrège plusieurs erreurs de schéma et erreurs transverses', async () => {
    const racine = await creerCorpusValide();
    await ecrireMarkdown(racine, 'contenu/actualites/nom-invalide.md', { ...actualiteValide, titre: '' }, '   \n');
    await ecrireMarkdown(racine, 'contenu/evenements/2026-09-08-evenement-ppc.md', { ...evenementValide, personnes_liees: ['personne-absente'] }, 'Contenu.');
    await ecrireMarkdown(racine, 'contenu/ressources/guide-ppc.md', { ...ressourceValide, destination_directe: '/documents/ressources/absent.pdf' }, 'Corps interdit.');
    const rapport = await validerContenus(racine);
    expect(rapport.erreurs.length).toBeGreaterThanOrEqual(5);
    expect(rapport.erreurs.some((erreur) => erreur.message.includes('Schéma invalide'))).toBe(true);
    expect(rapport.erreurs.some((erreur) => erreur.message.includes('Personne inexistante'))).toBe(true);
    expect(rapport.erreurs.some((erreur) => erreur.message.includes('introuvable'))).toBe(true);
  });
});
