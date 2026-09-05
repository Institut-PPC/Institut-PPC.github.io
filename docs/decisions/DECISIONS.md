# Journal des décisions

## Objet

Ce fichier conserve les décisions produit et d'architecture significatives dont la justification pourra être utile ultérieurement.

Il **ne constitue pas une spécification normative**. Les spécifications courantes sous `docs/` prévalent.

Ce journal est volontairement séparé afin de pouvoir être compacté, archivé ou purgé sans polluer les spécifications actuelles.

## Langue

Le journal des décisions est rédigé en français.

## Format suggéré

### AAAA-MM-JJ — Titre de la décision

**Statut :** Acceptée / Provisoire / Remplacée

**Décision :** Ce qui a été choisi.

**Pourquoi :** Justification concise.

**Alternatives étudiées :** Uniquement si utile.

**À réexaminer lorsque :** Déclencheur éventuel justifiant de rouvrir la décision.

---

## Décisions initiales de cadrage

### 2026-09-04 — Le POC doit être proche de la production

**Statut :** Acceptée

**Décision :** Construire le POC comme une V1 presque finale pouvant de préférence être complétée et mise en production après validation plutôt que jetée.

**Pourquoi :** La co-présidence doit pouvoir se projeter dans l'expérience réelle et tester le modèle éditorial.

### 2026-09-04 — PPC est l'identité principale du site

**Statut :** Acceptée

**Décision :** Le site représente la Pérennité Programmée Circulaire au sens large. L'association en constitue une section dédiée plutôt que l'identité englobante de toutes les pages.

### 2026-09-04 — CMS structuré, pas constructeur de pages

**Statut :** Acceptée

**Décision :** Les contributeurs non techniques gèrent les contenus structurés évolutifs. Structure, navigation, composants, comportements et implémentation du design restent dans le code.

**Pourquoi :** Préserver flexibilité et maintenabilité tout en donnant une autonomie éditoriale à l'association.

### 2026-09-04 — Projet et V1 en français

**Statut :** Acceptée

**Décision :** La V1/POC et toute la documentation du projet sont rédigées en français. Les termes imposés par les outils/langages peuvent rester en anglais lorsque nécessaire.

**Pourquoi :** La reprise du projet par un futur mainteneur ne doit pas dépendre de sa maîtrise de l'anglais.

### 2026-09-04 — Socle statique Astro/GitHub/GitHub Pages

**Statut :** Acceptée

**Décision :** Utiliser Astro, GitHub, GitHub Pages et GitHub Actions comme socle.

**Pourquoi :** Ce modèle est déjà maîtrisé et éprouvé par le porteur du projet ; il est simple, peu coûteux, statique et cohérent avec la pérennité et la sobriété.

### 2026-09-04 — Indépendance runtime du site public essentiel

**Statut :** Acceptée

**Décision :** Le fonctionnement public essentiel ne doit pas dépendre de services tiers à l'exécution. Les exceptions sont évaluées au cas par cas.

**Pourquoi :** Pérennité, simplicité, sobriété, sécurité et limitation de la dépendance fournisseur.

### 2026-09-04 — La sobriété numérique est un principe de premier rang

**Statut :** Acceptée

**Décision :** Maintenir une faible consommation de ressources côté client et infrastructure, et supporter des terminaux raisonnablement anciens ainsi que des connexions modestes.

**Pourquoi :** La sobriété numérique et la limitation de l'obsolescence matérielle sont directement cohérentes avec PPC.

### 2026-09-04 — Aucun analytics dans le POC

**Statut :** Acceptée

**Décision :** Ne pas implémenter d'analytics initialement tout en permettant l'ajout futur d'une solution légère et respectueuse de la vie privée.

**Pourquoi :** L'équipe doit d'abord décider si la mesure justifie son coût et ses implications.

### 2026-09-04 — Contenus indépendants du CMS et réversibles

**Statut :** Acceptée

**Décision :** Conserver les contenus dans des formats simples/ouverts sous contrôle de version Git. Le CMS est une interface, pas le propriétaire des contenus.

**Pourquoi :** Portabilité à long terme, traçabilité, réversibilité et confiance des contributeurs.

### 2026-09-04 — Le choix du CMS reste ouvert

**Statut :** Provisoire

**Décision :** Considérer DecapCMS comme candidat de référence, pas comme décision finale.

**Pourquoi :** Il est déjà connu et éprouvé dans un projet similaire, mais PPC doit encore comparer l'UX éditoriale, la modélisation, l'authentification, la preview, la portabilité et la maintenance.

### 2026-09-04 — La prévisualisation éditoriale est souhaitable mais doit rester simple

**Statut :** Provisoire

**Décision :** Étudier les options légères de preview lors du choix du CMS. Ne pas introduire une infrastructure disproportionnée uniquement pour cette fonction.

### 2026-09-04 — Pas de staging dédié initialement

**Statut :** Acceptée

**Décision :** Tester localement pendant le POC. Ajouter un staging uniquement si un besoin concret apparaît.

### 2026-09-04 — GitHub Actions assure validation, build et déploiement

**Statut :** Acceptée

**Décision :** Utiliser GitHub Actions pour les contrôles de non-régression, le build Astro et le déploiement sur GitHub Pages.

### 2026-09-04 — Pull Requests facultatives initialement

**Statut :** Acceptée

**Décision :** Autoriser le travail direct sur `main` ; utiliser branches et PR lorsque cela apporte de la valeur pour des changements importants ou risqués.

**Pourquoi :** Garder un petit projet fluide tout en permettant de renforcer la gouvernance ultérieurement.

### 2026-09-04 — Les spécifications et l'implémentation doivent rester synchronisées

**Statut :** Acceptée

**Décision :** Une évolution fonctionnelle ou technique n'est pas terminée tant que code, configuration, tests et spécifications affectées ne sont pas cohérents.

**Pourquoi :** Le dépôt doit rester compréhensible et fiable pour les futurs humains et agents IA.

### 2026-09-04 — L'historique des décisions reste séparé des spécifications

**Statut :** Acceptée

**Décision :** Conserver les justifications historiques dans ce journal compactable/purgeable. Garder les spécifications propres et normatives.

### 2026-09-04 — Le dépôt est la source de vérité du site

**Statut :** Acceptée

**Décision :** Stocker dans GitHub le code, la configuration, les contenus, ressources pertinentes, spécifications, documentation d'exploitation et historique des décisions.

**Pourquoi :** Une approche « tout en code/configuration » maximise traçabilité, portabilité, transmissibilité et facilité de travail pour les IA.

### 2026-09-05 — Architecture de l'information du POC validée

**Statut :** Acceptée

**Décision :** Formaliser une architecture où PPC reste l'identité principale du site, avec une navigation courte centrée sur Comprendre la PPC, Marque collective, Ressources, Actualités & événements et Association ; conserver Travailler avec nous hors menu principal et rattacher canoniquement les référentiels à la Marque collective.

**Pourquoi :** Permettre une découverte progressive — comprendre, approfondir, voir la formalisation concrète, puis éventuellement contribuer ou entrer en relation — sans donner à l'Association une place englobante ni créer prématurément des parcours métier non définis.

**À réexaminer lorsque :** Les tests du POC ou les retours de la co-présidence remettent en cause les hypothèses de navigation documentées, ou lorsque des parcours aujourd'hui absents (par exemple Adopter la PPC, Consortium, Partenaires / Écosystème) deviennent réellement actionnables.
