import { describe, expect, it } from 'vitest';

import { ANCRES_CHAPITRES_PPC, erreursStructureReferentiel, extrairePlanReferentiel } from '../src/lib/referentiel-ppc';

const markdownValide = ANCRES_CHAPITRES_PPC.map((_, index) => [
  `# ${index + 1}. Chapitre ${index + 1}`,
  '',
  `## ${index + 1}.1 Sous-section`,
  '',
  'Texte.',
].join('\n')).join('\n\n');

describe('structure du Référentiel PPC', () => {
  it('applique les dix ancres principales stables et dérive les sous-sections', () => {
    const plan = extrairePlanReferentiel(markdownValide);
    expect(plan.map(({ id }) => id)).toEqual([...ANCRES_CHAPITRES_PPC]);
    expect(plan[0]?.sousSections[0]?.id).toBe('1-1-sous-section');
    expect(erreursStructureReferentiel(markdownValide)).toEqual([]);
  });

  it('refuse un corps sans chapitre 1 ou avec une structure incomplète', () => {
    const erreurs = erreursStructureReferentiel('# Préambule interdit\n\n## Une section');
    expect(erreurs.some((erreur) => erreur.includes('exactement 10'))).toBe(true);
    expect(erreurs.some((erreur) => erreur.includes('commencer directement au chapitre 1'))).toBe(true);
  });
});
