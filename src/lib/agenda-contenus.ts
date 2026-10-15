import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { trierPublies, type Agenda, type Notice } from './agenda';

export async function chargerAgenda(): Promise<Agenda> {
  const actualites = trierPublies(await getCollection('actualites'), e => e.data.date_publication);
  const evenements = trierPublies(await getCollection('evenements'), e => e.data.date_debut, 1);
  return {
    maintenant: new Date().toISOString(),
    actualites: await Promise.all(actualites.map(async ({data}): Promise<Notice> => {
      const image = data.image_principale && await getImage({src: data.image_principale, width: 768, format: 'webp'});
      return {titre: data.titre, slug: data.slug, resume: data.resume, date: data.date_publication,
        ...(image ? {image: {src: image.src, width: Number(image.attributes.width), height: Number(image.attributes.height), alt: data.image_alt ?? ''}} : {})};
    })),
    evenements: evenements.map(({data}) => ({titre: data.titre, slug: data.slug, resume: data.resume,
      date: data.date_debut, fin: data.date_fin, lieu: data.lieu,
      relation: data.relation_ppc === 'organise-par-ppc' ? 'Organisé par l\'institut PPC' : 'Événement externe auquel l\'institut PPC participe'})),
  };
}
