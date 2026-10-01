import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const racineDist = path.resolve('dist');
const origineCanonique = 'https://www.perennite-programmee-circulaire.org';
const erreurs = [];

function verifier(condition, message) {
  if (!condition) erreurs.push(message);
}

async function lireFichier(cheminRelatif) {
  try {
    return await readFile(path.join(racineDist, cheminRelatif), 'utf8');
  } catch {
    erreurs.push(`dist/${cheminRelatif} est absent ou illisible.`);
    return '';
  }
}

function extraireAttribut(balise, nom) {
  return balise.match(new RegExp(`\\b${nom}=["']([^"']*)["']`, 'i'))?.[1];
}

function trouverMeta(html, attribut, valeur) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(([balise]) => balise)
    .find((balise) => extraireAttribut(balise, attribut) === valeur);
}

function trouverLien(html, rel) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map(([balise]) => balise)
    .find((balise) => extraireAttribut(balise, 'rel') === rel);
}

function normaliserChemin(url) {
  const pathname = new URL(url).pathname;
  return pathname === '/' ? pathname : pathname.replace(/\/$/, '');
}

const indexSitemap = await lireFichier('sitemap-index.xml');
const urlsSitemaps = [...indexSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
verifier(urlsSitemaps.length > 0, 'dist/sitemap-index.xml ne référence aucun sitemap.');

const contenusSitemaps = [];
for (const urlSitemap of urlsSitemaps) {
  let url;
  try {
    url = new URL(urlSitemap);
  } catch {
    erreurs.push(`Le sitemap référencé « ${urlSitemap} » n’est pas une URL valide.`);
    continue;
  }
  verifier(url.origin === origineCanonique, `Le sitemap référencé utilise une origine inattendue : ${urlSitemap}`);
  contenusSitemaps.push(await lireFichier(url.pathname.replace(/^\//, '')));
}

const urlsPubliques = contenusSitemaps
  .flatMap((contenu) => [...contenu.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url));
const cheminsPublics = new Set(urlsPubliques.map(normaliserChemin));
verifier(
  urlsPubliques.every((url) => new URL(url).origin === origineCanonique),
  'Toutes les URL du sitemap doivent utiliser le domaine canonique principal.',
);

for (const chemin of [
  '/',
  '/association',
  '/referentiel',
  '/referentiel/ppc',
  '/actualites-evenements',
  '/actualites/2026-09-edito-tf1info-durabilite-obsolescence',
]) {
  verifier(cheminsPublics.has(chemin), `Le sitemap ne contient pas la route publique représentative ${chemin}.`);
}

verifier(
  ![...cheminsPublics].some((chemin) => chemin === '/admin' || chemin.startsWith('/admin/')),
  'Le sitemap ne doit contenir aucune route /admin/.',
);
verifier(
  ![...cheminsPublics].some((chemin) => chemin === '/404' || chemin === '/404.html'),
  'Le sitemap ne doit contenir aucune route correspondant à la page 404.',
);
verifier(
  ![...cheminsPublics].some((chemin) => chemin.startsWith('/marque-collective/referentiels')),
  'Le sitemap ne doit plus contenir les anciennes routes /marque-collective/referentiels.',
);

const robots = await lireFichier('robots.txt');
verifier(/^User-agent: \*$/m.test(robots), 'robots.txt doit cibler tous les robots.');
verifier(/^Allow: \/$/m.test(robots), 'robots.txt doit autoriser globalement l’exploration.');
verifier(/^Disallow: \/admin\/$/m.test(robots), 'robots.txt doit interdire /admin/.');
verifier(
  /^Sitemap: https:\/\/www\.perennite-programmee-circulaire\.org\/sitemap-index\.xml$/m.test(robots),
  'robots.txt doit référencer le sitemap canonique.',
);

const pages = [
  { fichier: 'index.html', chemin: '/', imageSociale: false },
  { fichier: 'association/index.html', chemin: '/association/', imageSociale: false },
  { fichier: 'referentiel/index.html', chemin: '/referentiel/', imageSociale: false },
  { fichier: 'referentiel/ppc/index.html', chemin: '/referentiel/ppc/', imageSociale: false },
  {
    fichier: 'actualites/2026-09-edito-tf1info-durabilite-obsolescence/index.html',
    chemin: '/actualites/2026-09-edito-tf1info-durabilite-obsolescence/',
    imageSociale: true,
  },
];

for (const page of pages) {
  const html = await lireFichier(page.fichier);
  const urlAttendue = `${origineCanonique}${page.chemin}`;
  verifier(/<title>[^<]+<\/title>/i.test(html), `${page.fichier} doit contenir un titre.`);

  for (const [attribut, valeur] of [
    ['name', 'description'],
    ['property', 'og:type'],
    ['property', 'og:title'],
    ['property', 'og:description'],
    ['property', 'og:url'],
    ['property', 'og:site_name'],
    ['property', 'og:locale'],
  ]) {
    const balise = trouverMeta(html, attribut, valeur);
    verifier(Boolean(balise && extraireAttribut(balise, 'content')), `${page.fichier} doit contenir ${valeur}.`);
  }

  const canonical = trouverLien(html, 'canonical');
  const ogUrl = trouverMeta(html, 'property', 'og:url');
  const sitemap = trouverLien(html, 'sitemap');
  verifier(extraireAttribut(canonical ?? '', 'href') === urlAttendue, `${page.fichier} doit utiliser le canonical ${urlAttendue}.`);
  verifier(extraireAttribut(ogUrl ?? '', 'content') === urlAttendue, `${page.fichier} doit utiliser og:url ${urlAttendue}.`);
  verifier(
    extraireAttribut(sitemap ?? '', 'href') === `${origineCanonique}/sitemap-index.xml`,
    `${page.fichier} doit exposer le lien de découverte du sitemap.`,
  );
  verifier(
    extraireAttribut(trouverMeta(html, 'property', 'og:site_name') ?? '', 'content') === 'Pérennité Programmée Circulaire',
    `${page.fichier} doit exposer le nom complet du site.`,
  );
  verifier(
    extraireAttribut(trouverMeta(html, 'property', 'og:locale') ?? '', 'content') === 'fr_FR',
    `${page.fichier} doit exposer la locale fr_FR.`,
  );
  verifier(
    extraireAttribut(trouverMeta(html, 'property', 'og:type') ?? '', 'content') === 'website',
    `${page.fichier} doit exposer le type Open Graph website.`,
  );

  if (page.imageSociale) {
    const image = extraireAttribut(trouverMeta(html, 'property', 'og:image') ?? '', 'content');
    verifier(Boolean(image?.startsWith(`${origineCanonique}/`)), `${page.fichier} doit exposer une image Open Graph absolue.`);
    if (image?.startsWith(`${origineCanonique}/`)) {
      try {
        await access(path.join(racineDist, new URL(image).pathname));
      } catch {
        erreurs.push(`${page.fichier} référence une image Open Graph absente de dist/.`);
      }
    }
  } else {
    verifier(
      !trouverMeta(html, 'property', 'og:image'),
      `${page.fichier} ne doit pas inventer d’image Open Graph par défaut.`,
    );
  }
}

if (erreurs.length > 0) {
  console.error(`Contrôle du site généré en échec (${erreurs.length} erreur${erreurs.length > 1 ? 's' : ''}) :`);
  for (const erreur of erreurs) console.error(`- ${erreur}`);
  process.exitCode = 1;
} else {
  console.log(`Site généré conforme : ${urlsPubliques.length} URL publiques et ${pages.length} pages HTML contrôlées.`);
}
