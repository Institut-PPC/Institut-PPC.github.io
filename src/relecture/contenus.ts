import { parse } from 'yaml';
import { z } from 'zod';

const texte = z.string().refine((valeur) => valeur.trim().length > 0, 'Texte requis');
// Même structure de paragraphes que les pages éditoriales, sans rogner les retours approuvés.
const paragraphes = z.array(texte).min(1);
const urlHttps = z.url().refine((valeur) => {
  const url = URL.parse(valeur);
  return Boolean(url && url.protocol === 'https:' && !url.username && !url.password);
}, 'URL HTTPS sans identifiants requise');

export const schemaRelecture = z.strictObject({
  identifiant: z.string().regex(/^[0-9]{6}$/, 'Identifiant aléatoire de 6 chiffres requis (chaîne de caractères)'),
  titre: texte,
  url_pdf: urlHttps.refine((valeur) => URL.parse(valeur)?.hostname === 'drive.google.com', 'URL Google Drive requise'),
  url_formulaire: urlHttps.refine((valeur) => {
    const url = URL.parse(valeur);
    return Boolean(url && url.hostname === 'docs.google.com'
      && /^\/forms\/d\/(?:e\/)?[^/]+\/viewform$/.test(url.pathname)
      && url.searchParams.get('embedded') === 'true');
  }, 'URL Google Forms viewform avec embedded=true requise'),
  commentaires: z.array(z.strictObject({ auteur: texte, texte: paragraphes })).default([]),
});

export type Relecture = z.infer<typeof schemaRelecture>;

export function lireRelectures(fichiers: Record<string, string>): Relecture[] {
  const identifiants = new Set<string>();
  return Object.entries(fichiers).map(([fichier, contenu]) => {
    try {
      const livre = schemaRelecture.parse(parse(contenu));
      if (identifiants.has(livre.identifiant)) throw new Error('Identifiant de relecture dupliqué');
      identifiants.add(livre.identifiant);
      return livre;
    } catch (erreur) {
      throw new Error(`Relecture invalide dans ${fichier}`, { cause: erreur });
    }
  });
}
