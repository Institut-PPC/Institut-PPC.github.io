import { describe, expect, it } from 'vitest';
import { lignesDateNotice, afficherPlus, classerEvenements, deplacerMois, evenementsDuJour, evenementsDuMois, jourParis, joursDuMois,
  lireEtat, statutEvenement, trierPublies, urlEtat, type Notice } from '../src/lib/agenda';
const n = (date: string, fin?: string, slug = 'test'): Notice => ({date, fin, slug, titre: slug, resume: 'Résumé'});
const maintenant = '2026-10-15T12:00:00+02:00';
describe('agenda publié et chronologique', () => {
  it('exclut les brouillons et départage les dates égales par identifiant', () => {
    const entrees = [{id:'b', data:{publie:true}}, {id:'a', data:{publie:true}}, {id:'secret', data:{publie:false}}];
    expect(trierPublies(entrees, () => maintenant).map(e => e.id)).toEqual(['a','b']);
    expect(entrees).toHaveLength(3);
  });
  it('compare les instants et non les représentations des décalages', () => {
    const entrees = ['2026-10-15T10:00:00Z', '2026-10-15T11:00:00+02:00'].map((date,i) => ({id:String(i), data:{publie:true, date}}));
    expect(trierPublies(entrees, e => e.data.date).map(e => e.id)).toEqual(['0','1']);
  });
  it('classe les événements en cours jusqu’à leur fin incluse, sans inventer de durée', () => {
    expect(statutEvenement(n('2026-10-14T09:00:00Z', '2026-10-16T09:00:00Z'), maintenant)).toBe('encours');
    expect(statutEvenement(n(maintenant, maintenant), maintenant)).toBe('encours');
    expect(statutEvenement(n('2026-10-15T09:59:59Z'), maintenant)).toBe('passe');
    expect(statutEvenement(n('2026-10-16T09:00:00Z'), maintenant)).toBe('avenir');
  });
  it('trie les deux groupes dans les sens attendus', () => {
    const e = [n('2026-10-17T10:00:00Z'), n('2026-10-13T10:00:00Z'), n('2026-10-16T10:00:00Z'), n('2026-10-14T10:00:00Z')];
    const groupes = classerEvenements(e, maintenant);
    expect(groupes.avenir.map(e => e.date.slice(8,10))).toEqual(['16','17']);
    expect(groupes.passes.map(e => e.date.slice(8,10))).toEqual(['14','13']);
  });
});
describe('calendrier en Europe/Paris', () => {
  it('respecte minuit local et les changements d’heure', () => {
    expect(jourParis('2026-03-28T23:30:00Z')).toBe('2026-03-29');
    const e = n('2026-03-28T23:30:00Z', '2026-03-30T00:00:00+02:00');
    expect(evenementsDuJour([e], '2026-03-28')).toHaveLength(0);
    expect(evenementsDuJour([e], '2026-03-29')).toHaveLength(1);
    expect(evenementsDuJour([e], '2026-03-30')).toHaveLength(1);
    expect(jourParis('2026-10-25T01:30:00Z')).toBe('2026-10-25');
  });
  it('inclut tous les jours d’un événement à cheval sur deux mois et semaines', () => {
    const e = n('2026-09-29T09:00:00+02:00', '2026-10-06T18:00:00+02:00');
    expect(evenementsDuJour([e,e], '2026-10-01')).toHaveLength(2);
    expect(evenementsDuJour([e], '2026-10-06')).toHaveLength(1);
    expect(evenementsDuJour([e], '2026-10-07')).toHaveLength(0);
  });
  it('commence le lundi, traite les années bissextiles et change d’année', () => {
    expect(joursDuMois('2026-10').slice(0,4)).toEqual([null,null,null,'2026-10-01']);
    expect(joursDuMois('2028-02').filter(Boolean)).toHaveLength(29);
    expect(deplacerMois('2026-12',1)).toBe('2027-01');
    expect(deplacerMois('2027-01',-1)).toBe('2026-12');
  });
});
describe('URL et historique', () => {
  it('ouvre les actualités par défaut et respecte les anciennes ancres', () => {
    expect(lireEtat(new URL('https://ppc.test/actualites-evenements'), undefined, maintenant).onglet).toBe('actualites');
    expect(lireEtat(new URL('https://ppc.test/actualites-evenements#evenements'), undefined, maintenant).onglet).toBe('evenements');
  });
  it('partage calendrier, mois et sélection sans imposer des choix persistants', () => {
    const url = new URL('https://ppc.test/actualites-evenements?vue=calendrier&mois=2026-12&jour=2026-12-12#evenements');
    const etat = lireEtat(url, undefined, maintenant);
    expect(etat).toMatchObject({vue:'calendrier',mois:'2026-12',jour:'2026-12-12',actualites:9,avenir:6,passes:6});
    expect(urlEtat(url, etat).href).toBe(url.href);
    expect(lireEtat(new URL('https://ppc.test/'), undefined, maintenant)).toMatchObject({mois:'2026-10',vue:'liste',jour:''});
  });
  it('restaure séparément les lots sans ajouter ces compteurs à l’URL', () => {
    const url = new URL('https://ppc.test/#actualites');
    const etat = lireEtat(url, {actualites:27,avenir:12,passes:18}, maintenant);
    expect(etat).toMatchObject({actualites:27,avenir:12,passes:18});
    expect(urlEtat(url, etat).search).toBe('');
    expect(lireEtat(url, {actualites:NaN,avenir:-6,passes:2.5}, maintenant)).toMatchObject({actualites:9,avenir:6,passes:6});
  });
  it('refuse les dates URL impossibles ou étrangères au mois', () => {
    expect(lireEtat(new URL('https://ppc.test/?mois=2026-02&jour=2026-02-30'), undefined, maintenant).jour).toBe('');
    expect(lireEtat(new URL('https://ppc.test/?mois=2026-99'), undefined, maintenant).mois).toBe('2026-10');
  });
});

it('ajoute les lots de façon indépendante et conserve les contenus précédents', () => {
  const initial = lireEtat(new URL('https://ppc.test/'), undefined, maintenant);
  const etat = afficherPlus(afficherPlus(afficherPlus(initial, 'actualites'), 'avenir'), 'actualites');
  expect(etat).toMatchObject({actualites:27, avenir:12, passes:6});
  expect(initial).toMatchObject({actualites:9, avenir:6, passes:6});
  expect(afficherPlus(etat, 'passes')).toMatchObject({actualites:27, avenir:12, passes:12});
});

it('retrouve le mois et le jour conservés dans une entrée en vue Liste', () => {
  const etat = lireEtat(new URL('https://ppc.test/#evenements'), {mois:'2027-02',jour:'2027-02-12',vue:'liste'}, maintenant);
  expect(etat).toMatchObject({vue:'liste',mois:'2027-02',jour:'2027-02-12'});
});
it('limite les calculs du calendrier aux événements qui chevauchent le mois', () => {
  const e = n('2026-09-30T23:30:00Z', '2026-11-01T10:00:00Z');
  expect(evenementsDuMois([e], '2026-09')).toHaveLength(0);
  expect(evenementsDuMois([e], '2026-10')).toHaveLength(1);
  expect(evenementsDuMois([e], '2026-11')).toHaveLength(1);
  expect(evenementsDuMois([e], '2026-12')).toHaveLength(0);
});

it('préserve l’onglet lors du retour à une ancre interne avec état de navigation', () => {
  const url = new URL('https://ppc.test/actualites-evenements#contenu-principal');
  expect(lireEtat(url, {onglet:'evenements'}, maintenant).onglet).toBe('evenements');
  expect(lireEtat(url, undefined, maintenant).onglet).toBe('actualites');
});

describe('présentation des dates des événements', () => {
  it('affiche la date puis le créneau sans répétition pour une journée', () => {
    expect(lignesDateNotice(n('2026-10-15T18:30:00+02:00', '2026-10-15T22:00:00+02:00'), true))
      .toEqual(['15 octobre 2026', '18:30 – 22:00']);
  });
  it('conserve une seule heure sans fin et ne change pas les dates des actualités', () => {
    const e = n('2026-10-15T18:30:00+02:00');
    expect(lignesDateNotice(e, true)).toEqual(['15 octobre 2026', '18:30']);
    expect(lignesDateNotice(e, false)).toEqual(['15 octobre 2026']);
  });
  it('détermine la journée commune en heure de Paris, sans se fier au jour UTC', () => {
    expect(lignesDateNotice(n('2026-10-14T22:30:00Z', '2026-10-15T02:00:00Z'), true))
      .toEqual(['15 octobre 2026', '00:30 – 04:00']);
  });
  it('conserve le format complet pour plusieurs jours, y compris à minuit', () => {
    expect(lignesDateNotice(n('2026-10-15T18:30:00+02:00', '2026-10-16T00:00:00+02:00'), true))
      .toEqual(['15 octobre 2026 à 18:30 – 16 octobre 2026 à 00:00']);
  });
});
