export const formaterDate = (date: string) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(new Date(date));

export const formaterDateHeure = (date: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  }).format(new Date(date));

export const evenementAVenir = (dateFin: string | undefined, dateDebut: string, maintenant = new Date()) =>
  new Date(dateFin ?? dateDebut).getTime() >= maintenant.getTime();

export const libellesRessource = {
  video: 'Vidéo',
  ouvrage: 'Ouvrage',
  publication: 'Publication',
  formation: 'Formation',
  'travail-ppc': 'Travail PPC',
  autre: 'Ressource',
} as const;
