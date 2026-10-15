import { formaterDate, formaterDateHeure } from './contenus';

export interface Notice {
  titre: string; slug: string; resume: string; date: string; fin?: string;
  lieu?: string; relation?: string;
  image?: { src: string; width: number; height: number; alt: string };
}
export interface Agenda { actualites: Notice[]; evenements: Notice[]; maintenant: string }
export interface EtatAgenda {
  onglet: 'actualites' | 'evenements'; vue: 'liste' | 'calendrier'; mois: string;
  jour: string; actualites: number; avenir: number; passes: number;
}
const formatJourParis = new Intl.DateTimeFormat('fr-CA', {
  timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
});
export function jourParis(date: string | Date): string {
  const parties = formatJourParis.formatToParts(new Date(date));
  return ['year', 'month', 'day'].map(type => parties.find(p => p.type === type)!.value).join('-');
}
export function statutEvenement(e: Notice, maintenant: string): 'passe' | 'encours' | 'avenir' {
  const instant = Date.parse(maintenant);
  if (Date.parse(e.fin ?? e.date) < instant) return 'passe';
  return Date.parse(e.date) <= instant ? 'encours' : 'avenir';
}
export function trierPublies<T extends { id: string; data: { publie: boolean } }>(
  entrees: T[], date: (entree: T) => string, sens = -1,
): T[] {
  return entrees.filter(e => e.data.publie).sort((a, b) =>
    sens * (Date.parse(date(a)) - Date.parse(date(b))) || a.id.localeCompare(b.id, 'fr'));
}
export function classerEvenements(evenements: Notice[], maintenant: string) {
  const comparer = (a: Notice, b: Notice) => Date.parse(a.date) - Date.parse(b.date) || a.slug.localeCompare(b.slug, 'fr');
  return {
    avenir: evenements.filter(e => statutEvenement(e, maintenant) !== 'passe').sort(comparer),
    passes: evenements.filter(e => statutEvenement(e, maintenant) === 'passe').sort((a,b) => -comparer(a,b)),
  };
}
// Les dates éditoriales sont inclusives. Une fin à minuit appartient donc à ce jour.
export function evenementsDuJour(evenements: Notice[], jour: string): Notice[] {
  return evenements.filter(e => jourParis(e.date) <= jour && jourParis(e.fin ?? e.date) >= jour);
}
export function joursDuMois(mois: string): (string | null)[] {
  const [an, m] = mois.split('-').map(Number);
  const premier = new Date(Date.UTC(an, m - 1, 1));
  const decalage = (premier.getUTCDay() + 6) % 7;
  const jours: (string | null)[] = Array(decalage).fill(null);
  const nombre = new Date(Date.UTC(an, m, 0)).getUTCDate();
  for (let j = 1; j <= nombre; j++) jours.push(`${mois}-${String(j).padStart(2, '0')}`);
  while (jours.length % 7) jours.push(null);
  return jours;
}
export function deplacerMois(mois: string, delta: number): string {
  const [an, m] = mois.split('-').map(Number);
  return new Date(Date.UTC(an, m - 1 + delta, 1)).toISOString().slice(0, 7);
}
export const libelleMois = (mois: string) => new Intl.DateTimeFormat('fr-FR', {
  month: 'long', year: 'numeric', timeZone: 'Europe/Paris',
}).format(new Date(`${mois}-01T12:00:00Z`));
export const periode = (e: Notice) => e.fin
  ? `${formaterDateHeure(e.date)} – ${formaterDateHeure(e.fin)}` : formaterDateHeure(e.date);
export const dateNotice = (e: Notice, evenement: boolean) => evenement ? periode(e) : formaterDate(e.date);
// La journée est celle de Paris, indépendamment de la date UTC des instants sources.
export function lignesDateNotice(e: Notice, evenement: boolean): string[] {
  if (!evenement || (e.fin && jourParis(e.date) !== jourParis(e.fin))) return [dateNotice(e, evenement)];
  const heure = (date: string) => new Intl.DateTimeFormat('fr-FR', {
    timeStyle: 'short', timeZone: 'Europe/Paris',
  }).format(new Date(date));
  return [formaterDate(e.date), e.fin ? `${heure(e.date)} – ${heure(e.fin)}` : heure(e.date)];
}
export function lireEtat(url: URL, sauvegarde: Partial<EtatAgenda> | undefined, maintenant: string): EtatAgenda {
  const moisUrl = url.searchParams.get('mois');
  const moisCandidat = moisUrl ?? sauvegarde?.mois;
  const mois = moisCandidat && /^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(moisCandidat)
    ? moisCandidat : jourParis(maintenant).slice(0, 7);
  const jour = url.searchParams.get('jour') ?? (moisUrl ? '' : sauvegarde?.jour ?? '');
  const compteur = (n: unknown, base: number) => typeof n === 'number' && Number.isSafeInteger(n) && n >= base ? n : base;
  return {
    onglet: url.hash === '#evenements' ? 'evenements' : url.hash === '#actualites' ? 'actualites'
      : url.hash && sauvegarde?.onglet === 'evenements' ? 'evenements' : 'actualites',
    vue: url.searchParams.get('vue') === 'calendrier' ? 'calendrier' : 'liste',
    mois, jour: joursDuMois(mois).includes(jour) ? jour : '',
    actualites: compteur(sauvegarde?.actualites, 9), avenir: compteur(sauvegarde?.avenir, 6), passes: compteur(sauvegarde?.passes, 6),
  };
}
export function urlEtat(url: URL, etat: EtatAgenda): URL {
  const cible = new URL(url);
  cible.hash = etat.onglet;
  for (const cle of ['vue', 'mois', 'jour']) cible.searchParams.delete(cle);
  if (etat.vue === 'calendrier') {
    cible.searchParams.set('vue', etat.vue); cible.searchParams.set('mois', etat.mois);
    if (etat.jour) cible.searchParams.set('jour', etat.jour);
  }
  return cible;
}

export function afficherPlus(etat: EtatAgenda, liste: 'actualites' | 'avenir' | 'passes'): EtatAgenda {
  return {...etat, [liste]: etat[liste] + (liste === 'actualites' ? 9 : 6)};
}

export function evenementsDuMois(evenements: Notice[], mois: string): Notice[] {
  const jours = joursDuMois(mois).filter((j): j is string => j !== null);
  return evenements.filter(e => jourParis(e.date) <= jours[jours.length - 1] && jourParis(e.fin ?? e.date) >= jours[0]);
}
