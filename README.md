# Site PPC

Site public de la **Pérennité Programmée Circulaire (PPC)**.

Ce dépôt a vocation à contenir la source de vérité complète et maintenable du site : code, configuration, contenus structurés, ressources pertinentes, spécifications, documentation d'exploitation, tests et historique des décisions.

## Langue

La documentation du projet et les contenus de la V1/POC sont rédigés en **français**. Les termes techniques imposés par les outils ou langages peuvent rester en anglais lorsque cela améliore la clarté.

## État du projet

Le projet est actuellement au stade **POC / spécifications, avant implémentation**. Le POC n'est pas jetable : il doit être suffisamment proche d'une V1 finale pour pouvoir, s'il est validé, être complété puis mis en production plutôt que reconstruit.

## Socle prévu

- Astro
- GitHub
- GitHub Pages
- GitHub Actions pour validation, build et déploiement
- contenus structurés versionnés dans Git
- DecapCMS comme CMS du POC, avec contenus indépendants du CMS et backend GitHub direct + composant OAuth minimal
- V1/POC uniquement en français
- architecture statique, sobre, accessible et durable

## Documentation

Commencer par [`AGENTS.md`](AGENTS.md).

Les spécifications normatives se trouvent sous `docs/`. L'historique des décisions est volontairement séparé dans `docs/decisions/`.

## Développement

Les commandes d'installation, développement, test et build seront documentées ici une fois le projet Astro initialisé.

L'objectif est qu'un nouveau mainteneur humain ou un agent IA puisse cloner le dépôt, lire la documentation, installer les dépendances, lancer le site, valider ses modifications et le déployer sans dépendre de connaissances non documentées détenues par le mainteneur initial.
