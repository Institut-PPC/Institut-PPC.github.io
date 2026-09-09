# Site PPC

Site public de la **Pérennité Programmée Circulaire (PPC)**.

Ce dépôt a vocation à contenir la source de vérité complète et maintenable du site : code, configuration, contenus structurés, ressources pertinentes, spécifications, documentation d'exploitation, tests et historique des décisions.

## Langue

La documentation du projet et les contenus de la V1/POC sont rédigés en **français**. Les termes techniques imposés par les outils ou langages peuvent rester en anglais lorsque cela améliore la clarté.

## État du projet

Le projet est actuellement au stade **POC front fonctionnel**. Les spécifications et la conception technique détaillée sont terminées. Le socle Astro, l’ensemble des modèles canoniques récurrents, les fondations CSS du design system avec Tailwind, le shell commun et les parcours éditoriaux principaux sont implémentés. Les listings et routes dynamiques prennent en charge les actualités, événements, ressources et référentiels publiés, y compris lorsque les collections sont vides.

L’accueil, les pages éditoriales fixes remplies et la configuration éditoriale globale sont désormais alimentés depuis leurs singletons canoniques sous `contenu/` via le Content Layer Astro. La validation transverse couvre notamment les relations entre Personnes, Organisations et Événements. Le build et le déploiement GitHub Pages par GitHub Actions sont en place pour les push sur `main`, les Pull Requests vers `main`, les lancements manuels et le rebuild quotidien à 01:00 `Europe/Paris`. Decap CMS est intégré pour l’édition locale des contenus canoniques et les deux Netlify Functions OAuth de production sont implémentées. Leur mise en service nécessite encore les opérations manuelles documentées dans [`docs/exploitation/oauth-decap-netlify.md`](docs/exploitation/oauth-decap-netlify.md), notamment la création du site Netlify et de l'OAuth App GitHub puis le report de l'origine Netlify réelle dans Decap. Les contrôles dépendant d’une future configuration de redirections restent également à compléter avec ce contrat. Les textes présents dans le POC démontrent la structure et l’expérience du site ; ils ne constituent pas la rédaction éditoriale définitive.

Le POC n'est pas jetable : il doit être suffisamment proche d'une V1 finale pour pouvoir, s'il est validé, être complété puis mis en production plutôt que reconstruit.

## Socle prévu

- Astro
- GitHub
- GitHub Pages
- GitHub Actions pour validation, build et déploiement
- contenus structurés versionnés dans Git
- DecapCMS comme CMS du POC, avec contenus indépendants du CMS, backend GitHub direct et OAuth via deux Netlify Functions minimales
- V1/POC uniquement en français
- architecture statique, sobre, accessible et durable
- design tokens PPC centraux, Tailwind CSS pour la composition courante et CSS Astro scopé lorsque pertinent
- identité visuelle transitoire « Ingénierie sensible », conçue pour être remplacée facilement par la future identité de marque PPC
- rebuild/déploiement GitHub Pages quotidien à 01:00 `Europe/Paris`, en plus des déploiements sur `main`

## Documentation

Commencer par [`AGENTS.md`](AGENTS.md).

Les spécifications normatives se trouvent sous `docs/`. Le design system du POC est décrit dans [`docs/technique/design-system.md`](docs/technique/design-system.md). L'historique des décisions est volontairement séparé dans `docs/decisions/`.

## Front actuellement implémenté

Tailwind CSS 4 est compilé par `@tailwindcss/vite` dans la configuration Astro. Les deux dépendances sont réservées au développement et au build ; aucun moteur Tailwind ne tourne dans le navigateur. `src/styles/tailwind.css` expose les tokens PPC aux utilitaires et remplace le thème par défaut, avec les breakpoints globaux de 48 et 72 rem. Le reset léger reste dans `global.css` ; `tokens.css` conserve les valeurs de charte. Les CTA partagent le composant `ActionLink`.

Le Header utilise un panneau modal natif en dessous de **80 rem**, tablette comprise. Ce seuil local laisse la place aux cinq rubriques et au CTA sur une ligne en mode desktop. Une seule navigation est déplacée entre le panneau et le Header par `src/components/navigation.ts`, sans framework ni hydratation. Le panneau gère le focus, le défilement et le retour au bouton Menu ; Échap ferme d’abord une sous-rubrique ouverte, puis le panneau. Sur desktop, les sous-menus se ferment aussi au clic extérieur ou lorsque le focus les quitte. Sans JavaScript ou sans support de `showModal`, un menu HTML `details` donne accès aux mêmes liens.

Les routes fixes proposent désormais une composition éditoriale responsive conforme à l’architecture d’information. La page d’accueil, les pages pédagogiques et institutionnelles, les états vides et la page 404 forment un parcours démontrable. Les routes dynamiques sont générées uniquement pour les contenus publiés et, pour les ressources et référentiels, uniquement lorsque leur modèle demande une page interne.

Le Header utilise temporairement un asset local du logo actuel de l’Association, en attendant le travail sur l’identité de marque PPC. Les coordonnées publiques, liens d’adhésion et de don, mentions juridiques complètes et profils institutionnels réels restent volontairement absents tant que leurs données validées ne sont pas disponibles dans le dépôt.

## Développement

Prérequis : Node.js 22.12.0 ou une version ultérieure, et npm.

Installer les dépendances :

```sh
npm install
```

Lancer le serveur de développement :

```sh
npm run dev
```

### Éditer les contenus avec Decap en local

Après `npm install`, lancer les deux commandes suivantes dans deux terminaux depuis la racine du dépôt :

```sh
npm run dev
```

```sh
npm run dev:cms
```

Ouvrir ensuite `http://localhost:4321/admin/`, se connecter au proxy local, modifier un contenu puis l’enregistrer. Decap écrit directement dans les fichiers canoniques de `contenu/`. Les widgets image rangent les sources par famille sous `contenu/medias/images/`. La médiathèque globale range les documents sous `public/documents/` ; reporter ensuite leur chemin public `/documents/...` dans le champ du contenu concerné. Astro reflète les changements locaux ; avant de les conserver, exécuter `npm run validate` puis `npm run build` et examiner le diff Git.

L’édition locale fonctionne sans identifiant ni secret. Le backend GitHub direct, la branche `main` et la portée `public_repo` sont déclarés dans la configuration. Les deux Netlify Functions OAuth sont versionnées, mais l'URL de leur futur site Netlify n'est pas inventée dans le dépôt : suivre [`docs/exploitation/oauth-decap-netlify.md`](docs/exploitation/oauth-decap-netlify.md) pour créer le service, configurer ses secrets et renseigner le `base_url` réel avant le test de production.

Contrôler le projet avec Astro et TypeScript :

```sh
npm run check
```

Exécuter les tests unitaires :

```sh
npm run test
```

Valider l’intégrité transverse de tous les contenus (schémas, noms de fichiers, slugs, relations, sélections publiques, documents locaux et corps Markdown concernés) :

```sh
npm run validate
```

Cette commande agrège les erreurs avec leur fichier source et doit être exécutée après toute modification manuelle, via le CMS ou par un script d’import. Elle contrôle notamment l’existence des Personnes et Organisations référencées.

Construire le site statique dans `dist/` :

```sh
npm run build
```

Reproduire localement toute la phase de qualité et de build de la CI :

```sh
npm run ci
```

## Déploiement GitHub Pages

Le workflow `.github/workflows/deploy-pages.yml` exécute les tests, la validation transverse, le contrôle Astro/TypeScript et le build avant de publier exclusivement l’artifact Astro `dist/`. GitHub Pages doit être configuré dans **Settings → Pages → Build and deployment → Source** avec la valeur **GitHub Actions** ; la publication depuis une branche déclencherait à tort un build Jekyll sur les sources Astro.

Le remote actuel `Institut-PPC/Institut-PPC.github.io` correspond au dépôt Pages spécial de l’organisation. Son URL technique temporaire est donc `https://Institut-PPC.github.io/`. `SITE_URL` pilote cette origine au build afin de ne pas figer un futur domaine canonique PPC dans le code.

L'objectif est qu'un nouveau mainteneur humain ou un agent IA puisse cloner le dépôt, lire la documentation, installer les dépendances, lancer le site, valider ses modifications et le déployer sans dépendre de connaissances non documentées détenues par le mainteneur initial.
