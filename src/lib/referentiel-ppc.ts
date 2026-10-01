const ANCRES_CHAPITRES_PPC = [
  'introduction',
  'principes-utilisation',
  'conception-demontable',
  'vente-usage',
  'organisation-industrielle-circulaire',
  'gestion-composants',
  'articulation-systemique',
  'evaluation-demarche',
  'gouvernance-evolution',
  'bien-commun',
] as const;

export interface EntreePlanReferentiel {
  id: string;
  titre: string;
  sousSections: Array<{ id: string; titre: string }>;
}

export function slugifierTitreReferentiel(titre: string): string {
  return titre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extrairePlanReferentiel(markdown: string): EntreePlanReferentiel[] {
  const chapitres: EntreePlanReferentiel[] = [];
  const idsSousSections = new Set<string>();

  for (const ligne of markdown.replace(/\r\n?/g, '\n').split('\n')) {
    const chapitre = ligne.match(/^#\s+(.+?)\s*$/);
    if (chapitre) {
      const index = chapitres.length;
      chapitres.push({
        id: ANCRES_CHAPITRES_PPC[index] ?? `chapitre-${index + 1}`,
        titre: chapitre[1]!,
        sousSections: [],
      });
      continue;
    }

    const sousSection = ligne.match(/^##\s+(.+?)\s*$/);
    const chapitreCourant = chapitres.at(-1);
    if (!sousSection || !chapitreCourant) continue;

    const base = slugifierTitreReferentiel(sousSection[1]!);
    let id = base;
    let suffixe = 2;
    while (idsSousSections.has(id) || ANCRES_CHAPITRES_PPC.includes(id as never)) {
      id = `${base}-${suffixe}`;
      suffixe += 1;
    }
    idsSousSections.add(id);
    chapitreCourant.sousSections.push({ id, titre: sousSection[1]! });
  }

  return chapitres;
}

export function erreursStructureReferentiel(markdown: string): string[] {
  const erreurs: string[] = [];
  const chapitres = extrairePlanReferentiel(markdown);

  if (chapitres.length !== ANCRES_CHAPITRES_PPC.length) {
    erreurs.push(`Le corps doit contenir exactement ${ANCRES_CHAPITRES_PPC.length} chapitres de niveau 1 ; ${chapitres.length} détecté(s).`);
  }

  chapitres.forEach((chapitre, index) => {
    const numero = chapitre.titre.match(/^(\d+)\./)?.[1];
    if (numero !== String(index + 1)) {
      erreurs.push(`Le chapitre ${index + 1} doit commencer par « ${index + 1}. » afin de pouvoir lui appliquer l’ancre stable « ${chapitre.id} ».`);
    }
  });

  if (!markdown.trimStart().startsWith('# 1.')) {
    erreurs.push('Le corps Markdown doit commencer directement au chapitre 1.');
  }

  return erreurs;
}

export { ANCRES_CHAPITRES_PPC };
