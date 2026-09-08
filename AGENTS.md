# AGENTS.md — Site PPC

## Objet

Ce dépôt est la source de vérité du site public de la **Pérennité Programmée Circulaire (PPC)**.

Un humain comme une IA doit pouvoir comprendre, modifier, tester, déployer et reprendre le projet à partir du seul contenu de ce dépôt.

## Langue du projet

**Toute la documentation du projet doit être rédigée en français.**

Cela inclut notamment :
- les spécifications ;
- la documentation technique et d'exploitation ;
- les commentaires destinés à expliquer des choix non évidents ;
- le journal des décisions ;
- les contenus éditoriaux du site pour la V1/POC ;
- les instructions destinées aux humains et aux agents IA.

Les noms imposés par les outils, langages, bibliothèques, API, commandes ou conventions techniques peuvent naturellement rester en anglais lorsque les traduire serait artificiel ou nuisible à la compréhension.

Lorsqu'un agent IA crée ou modifie de la documentation, il doit la rédiger en français, sauf instruction explicite contraire.

## À lire avant toute modification

Avant de modifier le projet, lire les spécifications pertinentes pour la tâche :

- `docs/product/vision-et-perimetre.md`
- `docs/product/architecture-information.md`
- `docs/product/exigences-fonctionnelles.md`
- `docs/contenu/contenu-et-cms.md`
- `docs/technique/architecture.md`
- `docs/technique/design-system.md`
- `docs/technique/qualite-accessibilite-seo.md`
- `docs/exploitation/exploitation.md`

Consulter `docs/decisions/DECISIONS.md` uniquement lorsque l'historique ou la justification d'un choix est utile. Ce fichier n'est pas une spécification normative.

## Autorité et cohérence

Les spécifications courantes décrivent l'état souhaité actuel du site.

Une ancienne décision du journal ne prévaut jamais sur une spécification actuelle. Si le code, la configuration et les spécifications divergent, cette divergence doit être résolue explicitement.

**Définition de terminé :** une modification n'est pas terminée tant que le code, la configuration, les tests et les spécifications concernées ne sont pas cohérents.

Si une spécification décrit une cible qui n'est pas encore implémentée, cela doit être indiqué explicitement.

## Principes d'ingénierie

1. Privilégier une architecture statique, simple et durable.
2. Minimiser la surface d'attaque, les dépendances à l'exécution, l'infrastructure et les secrets. Le HTML statique reste le défaut ; le JavaScript côté client reste ciblé sur les besoins fonctionnels ou UX réels et proportionnés.
3. Le fonctionnement essentiel du site public ne doit pas dépendre de services tiers à l'exécution.
4. Les dépendances externes sont acceptables au cas par cas lorsque leur valeur justifie clairement leur coût en complexité, pérennité, sobriété, sécurité et dépendance fournisseur.
5. Les contenus doivent rester dans des formats simples, ouverts et versionnés, indépendants du CMS.
6. Le CMS est une interface d'édition, pas le propriétaire des données.
7. Privilégier les standards Web éprouvés, l'amélioration progressive, l'accessibilité, la performance et la compatibilité avec des terminaux raisonnablement anciens et des connexions modestes.
8. Éviter la sur-ingénierie. Ne pas ajouter d'infrastructure ou d'abstraction avant qu'un besoin concret ne le justifie.
9. Les choix visuels doivent rester faciles à faire évoluer : centraliser les variables de design et utiliser des composants réutilisables.
10. Documenter les comportements et choix d'architecture importants afin qu'un autre humain ou une autre IA puisse reprendre le projet sans connaissance implicite.

## Socle technique actuel

- Générateur de site statique : **Astro**
- Source, configuration et contenus : **dépôt Git hébergé sur GitHub**
- Hébergement public : **GitHub Pages**
- CI/CD : **GitHub Actions**
- CMS du POC : **DecapCMS**, utilisé comme interface d’édition au-dessus des contenus Git.
- Authentification CMS cible : backend GitHub direct complété par **deux Netlify Functions OAuth minimales** ; **Git Gateway n’est pas retenu**.
- Alternative future crédible : **Sveltia CMS**, sans migration structurante des contenus si un remplacement devient utile.
- Langue de la V1/POC : **français**
- Styles du POC : **design tokens PPC centraux + Tailwind CSS pour la composition courante + CSS Astro scopé lorsque cela améliore la lisibilité ou exprime une logique propre au composant**. `src/styles/tokens.css` reste la source de vérité de la charte.
- Identité visuelle du POC : **« Ingénierie sensible »**, volontairement transitoire et réversible en vue de la future identité de marque PPC.
- Analytics : **aucun dans le POC**
- Environnement de staging dédié : **aucun initialement**
- Pull Requests : **facultatives initialement**
- Decap écrit directement sur `main` en mode simple ; les branches/PR restent disponibles pour les changements longs ou sensibles.
- GitHub Actions rebuild et redéploie également le site **tous les jours à 01:00 `Europe/Paris`** afin d’actualiser les contenus dépendants de la date.
- Les tests locaux constituent le mode normal de vérification avant publication.

Ne pas remplacer ces choix sans besoin concret et décision explicite.

## Règles de travail pour les agents IA

Avant l'implémentation :
- examiner le dépôt existant et les spécifications pertinentes ;
- signaler les ambiguïtés plutôt que d'inventer silencieusement des règles métier ;
- privilégier la solution la plus simple satisfaisant l'exigence documentée ;
- distinguer clairement ce qui est implémenté de ce qui est futur ou envisagé.

Pendant l'implémentation :
- conserver des modèles de contenu structurés et portables ;
- garder le rendu essentiel statique autant que possible ;
- ne pas introduire sans justification de scripts tiers à l'exécution ;
- ne jamais exposer d'identifiants ou secrets côté client ;
- ne jamais ajouter dans le dépôt de secrets, mots de passes, ou données sensibles similaires ;
- préserver des URL publiques sémantiques et stables ;
- maintenir les fondamentaux d'accessibilité et de SEO ;
- ajouter ou mettre à jour les protections contre les régressions lorsque cela est utile.

Après l'implémentation :
- exécuter les commandes de validation du dépôt ;
- mettre à jour toutes les spécifications affectées ;
- mettre à jour la documentation d'exploitation lorsque les procédures changent ;
- ajouter une entrée au journal des décisions uniquement pour une décision significative dont la justification sera utile ultérieurement.

## Discipline du journal des décisions

`docs/decisions/DECISIONS.md` est volontairement séparé des spécifications.

Il peut être compacté, archivé ou purgé périodiquement. Les spécifications ne doivent jamais dépendre du journal pour décrire le comportement actuel requis.

Ne pas polluer les spécifications normatives avec l'historique chronologique des décisions.
