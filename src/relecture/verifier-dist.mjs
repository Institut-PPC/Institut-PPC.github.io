import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// Contrôle isolé, appelé par le contrôle post-build existant.
export async function verifierRelectures(racineDist) {
  const erreurs = [];
  async function parcourir(dossier) {
    const fichiers = [];
    for (const entree of await readdir(dossier, { withFileTypes: true })) {
      const chemin = path.join(dossier, entree.name);
      if (entree.isDirectory()) fichiers.push(...await parcourir(chemin));
      else fichiers.push(chemin);
    }
    return fichiers;
  }
  const fichiers = await parcourir(racineDist);
  const textes = await Promise.all(fichiers.filter((fichier) => /\.(html|xml|json|txt|js|css)$/.test(fichier))
    .map(async (fichier) => ({ fichier, relatif: path.relative(racineDist, fichier).split(path.sep).join('/'), texte: await readFile(fichier, 'utf8') })));
  const pages = textes.filter(({ relatif }) => relatif.startsWith('relecture/'));
  for (const page of pages) {
    const identifiant = page.relatif.match(/^relecture\/([0-9]{6})\/index\.html$/)?.[1];
    if (!identifiant) {
      erreurs.push(`Page de relecture inattendue : ${page.relatif}`);
      continue;
    }
    const metas = page.texte.match(/<meta\b[^>]*>/g) ?? [];
    if (!metas.some((meta) => /name="robots"/.test(meta) && /content="noindex"/.test(meta))) {
      erreurs.push(`${page.relatif} doit porter noindex.`);
    }
    for (const autre of textes) {
      if (autre.fichier !== page.fichier && autre.texte.includes(identifiant)) {
        erreurs.push(`Identifiant de relecture repris dans ${autre.relatif}.`);
      }
    }
  }
  for (const fichier of textes) {
    if (/\.xml$/.test(fichier.relatif) && /\/relecture(?:\/|<)/.test(fichier.texte)) {
      erreurs.push(`Une relecture apparaît dans ${fichier.relatif}.`);
    }
  }
  const robots = textes.find(({ relatif }) => relatif === 'robots.txt')?.texte ?? '';
  if (/^Disallow:\s*\/relecture/im.test(robots)) erreurs.push('robots.txt ne doit pas bloquer la lecture de noindex des relectures.');
  return erreurs;
}
