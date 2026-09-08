# Site PPC

Site public de la **Pérennité Programmée Circulaire (PPC)**.

Ce dépôt a vocation à contenir la source de vérité complète et maintenable du site : code, configuration, contenus structurés, ressources pertinentes, spécifications, documentation d'exploitation, tests et historique des décisions.

## Langue

La documentation du projet et les contenus de la V1/POC sont rédigés en **français**. Les termes techniques imposés par les outils ou langages peuvent rester en anglais lorsque cela améliore la clarté.

## État du projet

Le projet est actuellement au stade **POC front fonctionnel**. Les spécifications et la conception technique détaillée sont terminées. Le socle Astro, les premiers modèles du Content Layer, les fondations CSS du design system avec Tailwind, le shell commun et les parcours éditoriaux principaux sont implémentés. Les listings et routes dynamiques prennent en charge les actualités, événements, ressources et référentiels publiés, y compris lorsque les collections sont vides.

Le CMS, les singletons éditoriaux, les validations transverses complètes et le déploiement décrits dans les spécifications ne sont pas encore implémentés. Les textes présents dans le POC démontrent la structure et l’expérience du site ; ils ne constituent pas la rédaction éditoriale définitive.

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

La signature PPC reste textuelle en attendant un logo local approuvé. Les coordonnées publiques, liens d’adhésion et de don, mentions juridiques complètes et profils institutionnels réels restent volontairement absents tant que leurs données validées ne sont pas disponibles dans le dépôt.

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

Contrôler le projet avec Astro et TypeScript :

```sh
npm run check
```

Exécuter les tests unitaires :

```sh
npm run test
```

Construire le site statique dans `dist/` :

```sh
npm run build
```

L'objectif est qu'un nouveau mainteneur humain ou un agent IA puisse cloner le dépôt, lire la documentation, installer les dépendances, lancer le site, valider ses modifications et le déployer sans dépendre de connaissances non documentées détenues par le mainteneur initial.
