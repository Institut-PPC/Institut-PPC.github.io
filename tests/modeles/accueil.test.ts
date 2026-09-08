import { describe, expect, it } from 'vitest';

import { schemaAccueil } from '../../src/modeles/accueil';

const accueilMinimal = {
  titre_page: 'PPC',
  description: 'Présentation de PPC.',
  hero: {
    surtitre: 'Une démarche collective',
    titre_lignes: ['Pérennité', 'Programmée', 'Circulaire'],
    introduction: 'Introduction à la démarche.',
  },
  pourquoi: {
    surtitre: 'Pourquoi',
    titre: 'Comprendre la démarche',
    principes: [
      { numero: '01', titre: 'Comprendre', texte: 'Découvrir la démarche.' },
      { numero: '02', titre: 'Approfondir', texte: 'Consulter les travaux.' },
      { numero: '03', titre: 'Contribuer', texte: 'Prendre part aux travaux.' },
    ],
  },
  cadre_concret: { surtitre: 'Cadre', titre: 'Un cadre concret', texte: 'Le cadre de PPC.' },
  contribuer: { surtitre: 'Contribuer', titre: 'Construire ensemble' },
  approfondir: { surtitre: 'Approfondir', titre: 'Aller plus loin' },
  ressources_mises_en_avant: [],
  mouvement: { surtitre: 'Actualités', titre: 'PPC en mouvement' },
  association: { surtitre: 'Association', titre: 'Porter PPC', texte: 'Le rôle de l’Association.' },
};

describe('schemaAccueil', () => {
  it('accepte une sélection ordonnée de ressources par identifiants PPC', () => {
    expect(
      schemaAccueil.safeParse({
        ...accueilMinimal,
        ressources_mises_en_avant: ['livre-blanc-ppc', 'grand-cours-sator'],
      }).success,
    ).toBe(true);
  });

  it('refuse une référence de ressource qui n’est pas un identifiant PPC canonique', () => {
    expect(
      schemaAccueil.safeParse({
        ...accueilMinimal,
        ressources_mises_en_avant: ['Livre blanc PPC'],
      }).success,
    ).toBe(false);
  });
});
