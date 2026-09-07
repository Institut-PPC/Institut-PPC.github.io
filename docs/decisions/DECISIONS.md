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

**Statut :** Remplacée le 2026-09-06

**Décision :** Considérer DecapCMS comme candidat de référence, pas comme décision finale.

**Pourquoi :** Il est déjà connu et éprouvé dans un projet similaire, mais PPC devait encore comparer l'UX éditoriale, la modélisation, l'authentification, la preview, la portabilité et la maintenance.

**Remplacée par :** la décision du 2026-09-06 retenant DecapCMS pour le POC.

### 2026-09-04 — La prévisualisation éditoriale est souhaitable mais doit rester simple

**Statut :** Acceptée

**Décision :** Utiliser une preview éditoriale lorsqu'elle apporte une aide utile, sans exiger une reproduction pixel-perfect du rendu public ni introduire une infrastructure disproportionnée uniquement pour cette fonction.

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

### 2026-09-06 — Modèles de contenu structurés et singletons hybrides

**Statut :** Acceptée

**Décision :** Structurer les contenus récurrents autour des modèles `Actualité`, `Événement`, `Personne`, `Organisation`, `Ressource` et `Référentiel`. Représenter les pages éditoriales fixes comme des singletons hybrides, avec un singleton `Accueil` et un singleton de paramètres éditoriaux globaux. Conserver les entités canoniques sous forme de fichiers structurés manipulables indépendamment du CMS.

**Pourquoi :** Obtenir des contenus portables, réutilisables, automatisables et compréhensibles sans transformer le CMS en page builder.

### 2026-09-06 — Membres fondateurs représentés comme Personnes

**Statut :** Acceptée

**Décision :** Chaque membre fondateur présenté publiquement est une entité `Personne` portant le rôle `membre-fondateur`. Créer la route `/association/membres-fondateurs` avec une présentation visuelle incluant photo et LinkedIn.

**Pourquoi :** Éviter les listes dupliquées, permettre une présentation publique cohérente et garder la gouvernance dérivable des rôles structurés.

### 2026-09-06 — Ressources avec exposition hybride

**Statut :** Acceptée

**Décision :** Une `Ressource` choisit entre un mode lien direct et un mode page interne. La route `/ressources/<slug>` n'existe que pour les ressources configurées avec une page interne. La sélection de ressources de la homepage est manuelle et ordonnée dans le singleton `Accueil`.

**Pourquoi :** Couvrir les ressources externes simples comme les contenus PPC nécessitant une présence éditoriale durable sans imposer une page de détail à toutes les ressources.

### 2026-09-06 — Versionnement éditorial explicite des référentiels

**Statut :** Acceptée

**Décision :** Un `Référentiel` représente une identité durable contenant une liste structurée de versions et une `version_courante` désignée explicitement. La version courante n'est jamais déduite automatiquement de l'ordre, de la date ou du numéro.

**Pourquoi :** Distinguer l'historique éditorial public de l'historique technique Git et préserver l'intention éditoriale de PPC.

### 2026-09-06 — DecapCMS retenu pour le POC

**Statut :** Acceptée

**Décision :** Utiliser DecapCMS comme interface d'édition du POC au-dessus des contenus Git. Conserver les modèles de contenu indépendants de Decap et permettre la suppression ou le remplacement du CMS sans migration structurante des contenus.

**Pourquoi :** Decap couvre suffisamment les modèles PPC, respecte l'architecture Git/Astro/GitHub Pages et présente en 2026 un compromis de maturité, réversibilité et simplicité adapté au POC.

**Alternative étudiée :** Sveltia CMS reste l'alternative future privilégiée si son niveau de maturité devient supérieur ou si l'expérience Decap est insuffisante.

**À réexaminer lorsque :** l'expérience éditoriale réelle avec Decap devient limitante, Decap n'est plus suffisamment maintenu, ou Sveltia atteint une maturité et un modèle de maintenance jugés supérieurs.

### 2026-09-06 — Authentification Decap par GitHub direct et OAuth minimal

**Statut :** Acceptée

**Décision :** Utiliser le backend GitHub direct de Decap complété par un petit composant OAuth dédié. Ne pas utiliser Git Gateway dans la nouvelle architecture. Le composant OAuth ne doit pas devenir une dépendance runtime du site public.

**Pourquoi :** Préserver l'architecture GitHub Pages, limiter les dépendances externes et garder la couche d'authentification minimale et remplaçable.

### 2026-09-06 — Validation au build des contraintes insuffisamment garanties par le CMS

**Statut :** Acceptée

**Décision :** Garantir via schémas et/ou build les contraintes que Decap ne peut pas imposer proprement, notamment la cohérence de `Référentiel.version_courante`, la complétude de certaines `Personne` selon leurs rôles et les champs requis selon le mode d'exposition d'une `Ressource`.

**Pourquoi :** Ne pas déformer les modèles fonctionnels pour contourner des limites ergonomiques du CMS et conserver une validation fiable indépendante de l'interface d'édition.

### 2026-09-07 — Organisation physique canonique des contenus et identifiants par nom de fichier

**Statut :** Acceptée

**Décision :** Stocker les contenus canoniques sous `contenu/` à la racine du dépôt. Utiliser Markdown + front matter pour Actualité, Événement, Ressource, Référentiel et pages narratives ; YAML pour Personne, Organisation, Accueil et configuration éditoriale globale. Le nom de fichier sans extension est l'identifiant PPC canonique stable ; les relations stockent ces identifiants et les slugs publics restent indépendants. Les Actualités et Événements utilisent un préfixe `YYYY-MM-DD-` correspondant à la date de création du fichier, sans sémantique métier ultérieure.

**Pourquoi :** Séparer clairement patrimoine éditorial, code Astro et CMS ; conserver des fichiers humains, portables et simples à manipuler ; exploiter naturellement les identifiants du Content Layer et les relations Decap sans champ `id` redondant.

### 2026-09-07 — Content Layer Astro et validation PPC en trois niveaux

**Statut :** Acceptée

**Décision :** Faire du Content Layer Astro l'interface unique de consommation applicative des contenus, avec loaders officiels `glob()` et schémas Zod. Garantir l'intégrité par : schémas locaux, validateur TypeScript transverse PPC, puis contrôles sur le site construit. Aucun loader personnalisé ni lecture applicative directe des YAML/Markdown n'est introduit dans le POC.

**Pourquoi :** Obtenir un modèle typé et déterministe tout en conservant des règles PPC indépendantes du rendu Astro, avec des erreurs de build lisibles et actionnables.

### 2026-09-07 — Contrats de publication, ressources, référentiels et URL

**Statut :** Acceptée

**Décision :** Considérer `publie` comme un simple interrupteur d'exposition publique ; valider également les contenus non publiés ; interdire les sélections publiques explicites vers une cible non publiée. `Personne` et `Organisation` n'utilisent pas `publie`. Pour `Ressource`, rendre stricts les contrats `lien-direct` et `page-interne`, avec corps Markdown facultatif pour une page interne. Pour `Référentiel`, la présence du slug crée la page de détail et `version_courante` référence un identifiant de version interne stable. Considérer les slugs publiés comme stables et exiger une redirection explicite lors d'un changement exceptionnel.

**Pourquoi :** Éliminer les configurations ambiguës, préserver des relations stables et maintenir des URL durables sans transformer les contenus en workflow métier.

### 2026-09-07 — Politique technique des médias et documents

**Statut :** Acceptée

**Décision :** Stocker les images éditoriales locales sous `contenu/medias/images/` afin qu'Astro puisse les optimiser, et les documents téléchargeables servis tels quels sous `public/documents/`. Conserver les ressources tierces sous forme d'URL externe. Ne pas imposer de limite de poids arbitraire avant mesure réelle.

**Pourquoi :** Distinguer clairement les sources image qui bénéficient du pipeline Astro des fichiers publics stables, tout en gardant une politique simple et Git-based.

### 2026-09-07 — Intégration Decap minimale, richtext limité et preview légère

**Statut :** Acceptée

**Décision :** Mapper directement les modèles PPC en `folder collections` et `file collections` Decap, enregistrer les relations sur les identifiants dérivés des noms de fichiers, utiliser `publie: false` par défaut à la création et ne pas introduire de widget PPC spécifique pour le POC. Utiliser le widget `richtext` avec modes visuel/brut et un sous-ensemble Markdown limité à H2-H4, paragraphes, emphase, liens, listes, citations et images. La preview reste légère et non pixel-perfect. Deux smoke tests doivent valider le round-trip Markdown et la chaîne médias Decap → Astro.

**Pourquoi :** Garder Decap comme interface remplaçable, réduire la dette CMS et préserver le Markdown standard et lisible.

### 2026-09-07 — OAuth GitHub Decap via deux Netlify Functions

**Statut :** Acceptée

**Décision :** Utiliser le backend GitHub direct de Decap et deux Netlify Functions minimales `/auth` et `/callback` pour le flux OAuth. Le repository étant public, limiter le scope OAuth à `public_repo`. Ne pas utiliser Git Gateway. Netlify ne participe jamais au rendu public et ne stocke aucun contenu ou token durable.

**Pourquoi :** Cette architecture est légère, connue et déjà éprouvée par l'administrateur du projet, tout en maintenant GitHub comme autorité d'accès et le site public indépendant du service OAuth.

### 2026-09-07 — Decap écrit sur main et Git reste le mécanisme de rollback

**Statut :** Acceptée

**Décision :** Utiliser Decap en mode simple directement sur `main`. Chaque sauvegarde crée un commit et déclenche la CI. Ne pas activer `editorial_workflow`. Utiliser exceptionnellement une branche/PR pour une refonte longue ou sensible d'un contenu déjà publié. Utiliser Git pour le rollback et laisser la CI contrôler toute nouvelle publication.

**Pourquoi :** Préserver un workflow compréhensible pour une petite association sans sacrifier traçabilité, réversibilité ou possibilité de revue ponctuelle.

### 2026-09-07 — Pipeline qualité explicite et rebuild quotidien à 01:00 Europe/Paris

**Statut :** Acceptée

**Décision :** Séparer dans GitHub Actions la qualité/build du déploiement GitHub Pages. Les pushes sur `main` construisent et déploient ; les Pull Requests valident sans déployer ; un rebuild et redéploiement complet est également planifié tous les jours à **01:00 `Europe/Paris`**. Tout contrôle normatif en échec empêche le déploiement. Les tests ciblent les schémas, règles transverses, build Astro et contrôles du site généré sans seuil artificiel de couverture ni suite E2E lourde par défaut.

**Pourquoi :** Garantir que seules des versions valides sont publiées et que les contenus dépendant de la date courante — notamment les prochains événements — restent corrects même sans commit récent, tout en gardant un coût de maintenance raisonnable.

### 2026-09-07 — Identité visuelle transitoire « Ingénierie sensible »

**Statut :** Acceptée

**Décision :** Utiliser pour le POC une identité visuelle transitoire « Ingénierie sensible » : précise sans être froide, industrielle mais inscrite dans le vivant, sobre, intemporelle et prioritairement explicative. Utiliser le logo actuel de l'Association et l'illustration « Révéler la valeur invisible » comme références visuelles de départ, sans les considérer comme une charte de marque définitive. La future identité de la marque PPC doit pouvoir remplacer cette direction sans restructuration du site.

**Pourquoi :** Obtenir rapidement un POC crédible et cohérent sans investir excessivement dans une identité appelée à évoluer, tout en préservant la capacité de la future démarche de marque à refondre la charte.

### 2026-09-07 — CSS natif et design tokens centraux, sans Tailwind pour le POC

**Statut :** Acceptée

**Décision :** Utiliser CSS natif moderne et volontairement conservateur, sans Tailwind CSS, avec `src/styles/tokens.css` pour les fondations et tokens sémantiques, `src/styles/global.css` pour les règles réellement globales et du CSS scopé dans les composants Astro. Privilégier les standards Web largement disponibles et l'amélioration progressive.

**Pourquoi :** Le site PPC est petit, essentiellement statique et éditorial. Dans ce contexte, CSS natif maximise la lisibilité, limite les dépendances et facilite une future refonte de charte en concentrant les décisions visuelles dans les tokens et quelques primitives. Tailwind 4 a été considéré comme une solution mature, performante et compatible avec Astro, mais son abstraction supplémentaire n'apporte pas ici une valeur suffisante pour justifier sa dépendance et la distribution d'une partie des choix de présentation dans le markup.
