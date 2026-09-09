import { access, readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { parseDocument } from 'yaml';
import type { z } from 'zod';

import { schemaAccueil, type Accueil } from '../modeles/accueil.ts';
import { schemaActualite, type Actualite } from '../modeles/actualite.ts';
import { schemaConfigurationSite } from '../modeles/configuration-site.ts';
import { schemaEvenement, type Evenement } from '../modeles/evenement.ts';
import { schemaOrganisation, type Organisation } from '../modeles/organisation.ts';
import { schemaPageEditoriale } from '../modeles/page-editoriale.ts';
import { schemaPersonne, type Personne } from '../modeles/personne.ts';
import { schemaReferentiel, type Referentiel } from '../modeles/referentiel.ts';
import { schemaRessource, type Ressource } from '../modeles/ressource.ts';

export interface ErreurValidationContenu {
  chemin: string;
  message: string;
}

export interface RapportValidationContenus {
  erreurs: ErreurValidationContenu[];
}

interface EntreeValidee<T> {
  id: string;
  chemin: string;
  donnees: T;
  corps?: string;
}

interface CollectionChargee<T> {
  entrees: EntreeValidee<T>[];
  identifiants: Set<string>;
}

interface FichierSource {
  absolu: string;
  relatif: string;
  nom: string;
}

const motifIdentifiant = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const motifNomDate = /^(\d{4}-\d{2}-\d{2})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

function cheminRelatif(racine: string, chemin: string): string {
  return path.relative(racine, chemin).split(path.sep).join('/');
}

function ajouterErreur(
  erreurs: ErreurValidationContenu[],
  chemin: string,
  message: string,
): void {
  erreurs.push({ chemin, message });
}

async function listerFichiers(
  racine: string,
  dossierRelatif: string,
  extension: '.md' | '.yaml',
  erreurs: ErreurValidationContenu[],
  nomsIgnores: ReadonlySet<string> = new Set(),
): Promise<FichierSource[]> {
  const dossier = path.join(racine, dossierRelatif);
  let elements;

  try {
    elements = await readdir(dossier, { withFileTypes: true });
  } catch {
    ajouterErreur(erreurs, dossierRelatif, 'Le dossier canonique est absent ou illisible.');
    return [];
  }

  const fichiers: FichierSource[] = [];
  for (const element of elements.sort((a, b) => a.name.localeCompare(b.name, 'fr'))) {
    if (element.name.startsWith('.') || nomsIgnores.has(element.name)) continue;

    const absolu = path.join(dossier, element.name);
    const relatif = cheminRelatif(racine, absolu);

    if (!element.isFile()) {
      ajouterErreur(erreurs, relatif, 'Les collections de contenus doivent rester plates, sans sous-dossier.');
      continue;
    }

    if (!element.name.endsWith(extension)) {
      ajouterErreur(erreurs, relatif, `Le fichier doit utiliser l’extension ${extension}.`);
      continue;
    }

    fichiers.push({ absolu, relatif, nom: element.name });
  }

  return fichiers;
}

function analyserYaml(source: string, fichier: string, erreurs: ErreurValidationContenu[]): unknown | undefined {
  const document = parseDocument(source);
  if (document.errors.length > 0) {
    for (const erreur of document.errors) {
      ajouterErreur(erreurs, fichier, `YAML invalide : ${erreur.message.split('\n')[0]}`);
    }
    return undefined;
  }

  try {
    return document.toJS();
  } catch (erreur) {
    ajouterErreur(erreurs, fichier, `YAML illisible : ${erreur instanceof Error ? erreur.message : String(erreur)}`);
    return undefined;
  }
}

function analyserMarkdown(
  source: string,
  fichier: string,
  erreurs: ErreurValidationContenu[],
): { donnees: unknown; corps: string } | undefined {
  const lignes = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
  if (lignes[0]?.trim() !== '---') {
    ajouterErreur(erreurs, fichier, 'Le fichier Markdown doit commencer par un front matter YAML délimité par --- .');
    return undefined;
  }

  const finFrontMatter = lignes.findIndex((ligne, index) => index > 0 && ligne.trim() === '---');
  if (finFrontMatter === -1) {
    ajouterErreur(erreurs, fichier, 'Le délimiteur de fin du front matter YAML est absent.');
    return undefined;
  }

  const donnees = analyserYaml(lignes.slice(1, finFrontMatter).join('\n'), fichier, erreurs);
  if (donnees === undefined) return undefined;

  return { donnees, corps: lignes.slice(finFrontMatter + 1).join('\n') };
}

function validerSchema<T>(
  schema: z.ZodType<T>,
  donnees: unknown,
  fichier: string,
  erreurs: ErreurValidationContenu[],
): T | undefined {
  const resultat = schema.safeParse(donnees);
  if (resultat.success) return resultat.data;

  for (const probleme of resultat.error.issues) {
    const champ = probleme.path.length > 0 ? ` (champ ${probleme.path.join('.')})` : '';
    ajouterErreur(erreurs, fichier, `Schéma invalide${champ} : ${probleme.message}`);
  }
  return undefined;
}

function dateCalendaireValide(date: string): boolean {
  const [annee, mois, jour] = date.split('-').map(Number);
  const valeur = new Date(Date.UTC(annee!, mois! - 1, jour));
  return valeur.getUTCFullYear() === annee && valeur.getUTCMonth() === mois! - 1 && valeur.getUTCDate() === jour;
}

function validerNomFichier(
  fichier: FichierSource,
  type: 'date' | 'identifiant',
  erreurs: ErreurValidationContenu[],
): string | undefined {
  const id = path.basename(fichier.nom, path.extname(fichier.nom));

  if (type === 'date') {
    const correspondance = fichier.nom.match(motifNomDate);
    if (!correspondance || !dateCalendaireValide(correspondance[1]!)) {
      ajouterErreur(
        erreurs,
        fichier.relatif,
        'Le nom doit respecter YYYY-MM-DD-<identifiant-kebab-case>.md avec une date calendaire valide.',
      );
      return undefined;
    }
    return id;
  }

  if (!motifIdentifiant.test(id)) {
    ajouterErreur(erreurs, fichier.relatif, 'Le nom de fichier doit être un identifiant ASCII minuscule en kebab-case.');
    return undefined;
  }
  return id;
}

async function chargerCollectionMarkdown<T>(
  racine: string,
  dossier: string,
  schema: z.ZodType<T>,
  typeNom: 'date' | 'identifiant',
  erreurs: ErreurValidationContenu[],
): Promise<CollectionChargee<T>> {
  const fichiers = await listerFichiers(racine, dossier, '.md', erreurs);
  const entrees: EntreeValidee<T>[] = [];
  const identifiants = new Set<string>();

  for (const fichier of fichiers) {
    const id = validerNomFichier(fichier, typeNom, erreurs);
    if (id) identifiants.add(id);

    const source = await readFile(fichier.absolu, 'utf8');
    const markdown = analyserMarkdown(source, fichier.relatif, erreurs);
    if (!markdown) continue;
    const donnees = validerSchema(schema, markdown.donnees, fichier.relatif, erreurs);
    if (id && donnees) entrees.push({ id, chemin: fichier.relatif, donnees, corps: markdown.corps });
  }

  return { entrees, identifiants };
}

async function chargerCollectionYaml<T>(
  racine: string,
  dossier: string,
  schema: z.ZodType<T>,
  erreurs: ErreurValidationContenu[],
): Promise<CollectionChargee<T>> {
  const fichiers = await listerFichiers(racine, dossier, '.yaml', erreurs);
  const entrees: EntreeValidee<T>[] = [];
  const identifiants = new Set<string>();

  for (const fichier of fichiers) {
    const id = validerNomFichier(fichier, 'identifiant', erreurs);
    if (id) identifiants.add(id);
    const donneesBrutes = analyserYaml(await readFile(fichier.absolu, 'utf8'), fichier.relatif, erreurs);
    if (donneesBrutes === undefined) continue;
    const donnees = validerSchema(schema, donneesBrutes, fichier.relatif, erreurs);
    if (id && donnees) entrees.push({ id, chemin: fichier.relatif, donnees });
  }

  return { entrees, identifiants };
}

async function chargerSingleton<T>(
  racine: string,
  fichierRelatif: string,
  schema: z.ZodType<T>,
  erreurs: ErreurValidationContenu[],
): Promise<EntreeValidee<T> | undefined> {
  const absolu = path.join(racine, fichierRelatif);
  let source: string;
  try {
    source = await readFile(absolu, 'utf8');
  } catch {
    ajouterErreur(erreurs, fichierRelatif, 'Le singleton canonique est absent ou illisible.');
    return undefined;
  }

  const donneesBrutes = analyserYaml(source, fichierRelatif, erreurs);
  if (donneesBrutes === undefined) return undefined;
  const donnees = validerSchema(schema, donneesBrutes, fichierRelatif, erreurs);
  return donnees ? { id: path.basename(fichierRelatif, '.yaml'), chemin: fichierRelatif, donnees } : undefined;
}

function verifierCorpsObligatoire(
  entrees: EntreeValidee<unknown>[],
  type: string,
  erreurs: ErreurValidationContenu[],
): void {
  for (const entree of entrees) {
    if (!entree.corps?.trim()) {
      ajouterErreur(erreurs, entree.chemin, `Le corps Markdown éditorial de ${type} est obligatoire et ne peut pas être vide.`);
    }
  }
}

function verifierUniciteSlugs(
  entrees: EntreeValidee<unknown>[],
  lireSlug: (donnees: unknown) => string | undefined,
  espaceRoutes: string,
  erreurs: ErreurValidationContenu[],
): void {
  const fichiersParSlug = new Map<string, string[]>();
  for (const entree of entrees) {
    const slug = lireSlug(entree.donnees);
    if (!slug) continue;
    const fichiers = fichiersParSlug.get(slug) ?? [];
    fichiers.push(entree.chemin);
    fichiersParSlug.set(slug, fichiers);
  }

  for (const [slug, fichiers] of fichiersParSlug) {
    if (fichiers.length < 2) continue;
    for (const fichier of fichiers) {
      ajouterErreur(
        erreurs,
        fichier,
        `Le slug « ${slug} » est en doublon dans l’espace de routes ${espaceRoutes}. Fichiers en conflit : ${fichiers.join(', ')}.`,
      );
    }
  }
}

async function verifierDocumentLocal(
  racine: string,
  cheminPublic: string | undefined,
  fichierSource: string,
  erreurs: ErreurValidationContenu[],
): Promise<void> {
  if (!cheminPublic?.startsWith('/documents/')) return;
  const cheminPhysique = path.join(racine, 'public', cheminPublic.slice(1));
  try {
    await access(cheminPhysique);
    const informations = await stat(cheminPhysique);
    if (!informations.isFile()) throw new Error('pas un fichier');
  } catch {
    ajouterErreur(
      erreurs,
      fichierSource,
      `Le document local « ${cheminPublic} » est introuvable sous public/documents/.`,
    );
  }
}

export async function validerContenus(racine: string): Promise<RapportValidationContenus> {
  const erreurs: ErreurValidationContenu[] = [];

  const [actualites, evenements, personnes, organisations, ressources, referentiels] = await Promise.all([
    chargerCollectionMarkdown<Actualite>(racine, 'contenu/actualites', schemaActualite, 'date', erreurs),
    chargerCollectionMarkdown<Evenement>(racine, 'contenu/evenements', schemaEvenement, 'date', erreurs),
    chargerCollectionYaml<Personne>(racine, 'contenu/personnes', schemaPersonne, erreurs),
    chargerCollectionYaml<Organisation>(racine, 'contenu/organisations', schemaOrganisation, erreurs),
    chargerCollectionMarkdown<Ressource>(racine, 'contenu/ressources', schemaRessource, 'identifiant', erreurs),
    chargerCollectionMarkdown<Referentiel>(racine, 'contenu/referentiels', schemaReferentiel, 'identifiant', erreurs),
  ]);

  const fichiersPages = await listerFichiers(
    racine,
    'contenu/pages',
    '.md',
    erreurs,
    new Set(['accueil.yaml']),
  );
  for (const fichier of fichiersPages) {
    validerNomFichier(fichier, 'identifiant', erreurs);
    const markdown = analyserMarkdown(await readFile(fichier.absolu, 'utf8'), fichier.relatif, erreurs);
    if (markdown) validerSchema(schemaPageEditoriale, markdown.donnees, fichier.relatif, erreurs);
  }

  const [accueil] = await Promise.all([
    chargerSingleton<Accueil>(racine, 'contenu/pages/accueil.yaml', schemaAccueil, erreurs),
    chargerSingleton(racine, 'contenu/configuration/site.yaml', schemaConfigurationSite, erreurs),
  ]);

  verifierCorpsObligatoire(actualites.entrees, 'l’actualité', erreurs);
  verifierCorpsObligatoire(evenements.entrees, 'l’événement', erreurs);

  for (const ressource of ressources.entrees) {
    if (ressource.donnees.mode_exposition === 'lien-direct' && ressource.corps?.trim()) {
      ajouterErreur(
        erreurs,
        ressource.chemin,
        'Une Ressource en mode « lien-direct » doit avoir un corps Markdown vide.',
      );
    }
  }

  verifierUniciteSlugs(actualites.entrees, (donnees) => (donnees as Actualite).slug, '/actualites/<slug>', erreurs);
  verifierUniciteSlugs(evenements.entrees, (donnees) => (donnees as Evenement).slug, '/evenements/<slug>', erreurs);
  verifierUniciteSlugs(
    ressources.entrees,
    (donnees) => (donnees as Ressource).mode_exposition === 'page-interne' ? (donnees as Ressource & { slug: string }).slug : undefined,
    '/ressources/<slug>',
    erreurs,
  );
  verifierUniciteSlugs(referentiels.entrees, (donnees) => (donnees as Referentiel).slug, '/marque-collective/referentiels/<slug>', erreurs);

  for (const evenement of evenements.entrees) {
    for (const personne of evenement.donnees.personnes_liees ?? []) {
      if (!personnes.identifiants.has(personne)) {
        ajouterErreur(
          erreurs,
          evenement.chemin,
          `Le champ personnes_liees référence l’identifiant « ${personne} », absent de la collection personnes.`,
        );
      }
    }
    for (const organisation of evenement.donnees.organisations_liees ?? []) {
      if (!organisations.identifiants.has(organisation)) {
        ajouterErreur(
          erreurs,
          evenement.chemin,
          `Le champ organisations_liees référence l’identifiant « ${organisation} », absent de la collection organisations.`,
        );
      }
    }
  }

  for (const personne of personnes.entrees) {
    const organisation = personne.donnees.organisation;
    if (organisation && !organisations.identifiants.has(organisation)) {
      ajouterErreur(
        erreurs,
        personne.chemin,
        `Le champ organisation référence l’identifiant « ${organisation} », absent de la collection organisations.`,
      );
    }
  }

  if (accueil) {
    const ressourcesParId = new Map(ressources.entrees.map((ressource) => [ressource.id, ressource]));
    for (const id of accueil.donnees.ressources_mises_en_avant) {
      if (!ressources.identifiants.has(id)) {
        ajouterErreur(erreurs, accueil.chemin, `La ressource mise en avant « ${id} » n’existe pas.`);
        continue;
      }
      const ressource = ressourcesParId.get(id);
      if (ressource && !ressource.donnees.publie) {
        ajouterErreur(erreurs, accueil.chemin, `La ressource mise en avant « ${id} » doit avoir publie: true.`);
      }
    }
  }

  await Promise.all([
    ...ressources.entrees.flatMap((ressource) => {
      const destinations = ressource.donnees.mode_exposition === 'lien-direct'
        ? [ressource.donnees.destination_directe]
        : [ressource.donnees.lien_principal_associe];
      return destinations.map((destination) => verifierDocumentLocal(racine, destination, ressource.chemin, erreurs));
    }),
    ...referentiels.entrees.flatMap((referentiel) =>
      referentiel.donnees.versions.map((version) =>
        verifierDocumentLocal(racine, version.document, referentiel.chemin, erreurs),
      ),
    ),
  ]);

  return {
    erreurs: erreurs.sort((a, b) => a.chemin.localeCompare(b.chemin, 'fr') || a.message.localeCompare(b.message, 'fr')),
  };
}
