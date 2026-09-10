# Architecture technique

## Statut

Spécification normative de l'architecture technique du POC du site PPC.

La conception technique détaillée est stabilisée. Les choix laissés à l'implémentation concernent la factorisation interne du code et le choix précis de certains outils de test, pas l'architecture des contenus, le workflow éditorial, l'authentification, la validation ou le déploiement.

Les modèles fonctionnels de contenu sont définis dans [`../contenu/contenu-et-cms.md`](../contenu/contenu-et-cms.md). L'identité visuelle, les design tokens, l'architecture CSS et les primitives de rendu sont normés dans [`design-system.md`](design-system.md).

## Socle technique

Le socle retenu est :
- **Astro** pour la génération statique ;
- **GitHub** pour le dépôt et le versionnement ;
- **GitHub Pages** pour l'hébergement public ;
- **GitHub Actions** pour validation, tests, build et déploiement ;
- **DecapCMS** comme interface d'édition ;
- **deux Netlify Functions minimales** pour le flux OAuth GitHub utilisé par Decap.

Git Gateway n'est pas utilisé.

Ne pas remettre ce socle en concurrence sans besoin PPC concret et décision explicite.

## Architecture statique par défaut

Une raison majeure du choix statique est de minimiser la surface d'attaque, la complexité à l'exécution, l'infrastructure, la logique serveur, les secrets et la charge de maintenance.

Le HTML statique et la génération statique constituent le défaut. Ajouter du JavaScript côté client uniquement lorsqu'il répond à un besoin fonctionnel ou UX réel et proportionné. Une petite interaction TypeScript/JavaScript locale est acceptable, notamment pour un menu mobile, un disclosure ou une navigation, lorsque HTML/CSS seul produirait une UX sensiblement moins bonne ou une implémentation artificiellement complexe. Ne pas introduire de contorsion architecturale uniquement pour économiser quelques lignes de JavaScript justifié.

Le site n'est pas une SPA, ne reçoit pas d'hydratation globale et n'introduit aucun framework front-end client par défaut. React, Vue, Svelte ou équivalent ne peut être ajouté que si un besoin fonctionnel futur suffisamment riche le justifie explicitement. Le JavaScript décoratif gratuit reste exclu.

Le site public ne dépend à l'exécution ni de DecapCMS, ni de Netlify, ni du composant OAuth.

### Intégration publique HelloAsso

Les pages d'adhésion et de don utilisent un composant Astro réutilisable qui rend une `iframe` HelloAsso et un lien direct de repli. HelloAsso est une dépendance d'exécution limitée à ces formulaires : son indisponibilité ne doit empêcher ni le chargement du reste de la page, ni l'accès aux explications éditoriales, ni l'utilisation du lien direct lorsqu'il reste joignable.

Le redimensionnement repose sur un unique listener local `postMessage` par page, sans framework ni bibliothèque. Un message n'est appliqué que si son origine HTTPS correspond exactement à celle d'une URL HelloAsso configurée, si sa source est la fenêtre du cadre concerné et si sa propriété `height` est un nombre fini strictement positif. Cette association par source permet à plusieurs widgets de cohabiter sans identifiant global.

Le composant conserve une hauteur initiale de 750 px, une largeur de 100 %, le chargement différé, un titre accessible, l'autorisation de paiement requise par HelloAsso et aucune règle `sandbox` ajoutée localement.

## Structure physique du dépôt

Organisation cible :

```text
/
├── contenu/                     # contenus canoniques éditables
│   ├── actualites/
│   ├── evenements/
│   ├── personnes/
│   ├── organisations/
│   ├── ressources/
│   ├── referentiels/
│   ├── pages/
│   ├── configuration/
│   │   └── site.yaml
│   └── medias/
│       └── images/
│
├── src/                         # application Astro
│   ├── content.config.ts
│   ├── pages/
│   ├── layouts/
│   ├── components/
│   ├── styles/
│   │   ├── tokens.css
│   │   └── global.css
│   ├── assets/
│   │   └── identite/
│   └── ... schémas et validation
│
├── public/
│   ├── admin/                   # interface Decap
│   ├── documents/               # fichiers publics servis tels quels
│   ├── CNAME                    # domaine personnalisé GitHub Pages
│   └── robots.txt
│
├── scripts/                     # validation et automatisations ponctuelles
├── tests/                       # lorsque des fixtures/tests hors src le justifient
└── docs/                        # spécifications et exploitation
```

`contenu/` est indépendant du code Astro et du CMS. `src/` contient la logique du site. `public/` ne doit accueillir une image éditoriale que si elle doit volontairement être servie sans traitement ; les images éditoriales normales restent dans `contenu/medias/images/` pour profiter du pipeline Astro.

Dans l'application Astro, `src/styles/tokens.css` contient les fondations et tokens sémantiques et reste la source de vérité de la charte. `src/styles/global.css` se limite au reset léger et aux styles réellement globaux. Tailwind CSS fournit la couche utilitaire de composition courante — layout, responsive, espacements, dimensions, visibilité, positionnement et états d'interaction. Le CSS Astro scopé reste adapté aux structures ou comportements propres à un composant lorsque du CSS dédié est plus lisible que des utilitaires.

## Formats et identifiants

La répartition Markdown/YAML, les conventions de nommage et les identifiants sont normés dans [`../contenu/contenu-et-cms.md`](../contenu/contenu-et-cms.md).

Principes techniques :
- une entité répétable = un fichier ;
- dossier de collection plat ;
- nom de fichier sans extension = identifiant PPC canonique ;
- `slug` public indépendant de l'identifiant ;
- relations stockées comme identifiants canoniques ;
- `Actualité` et `Événement` utilisent un préfixe de date de création `YYYY-MM-DD-`, sans sémantique métier après création.

## Content Layer Astro

Tous les contenus canoniques sont consommés par l'application à travers le **Content Layer Astro**. Le code de rendu ne lit pas directement les YAML/Markdown avec `fs` ou un parseur parallèle.

### Collections

Déclarer dans `src/content.config.ts` une collection logique par modèle :
- `actualites` ;
- `evenements` ;
- `personnes` ;
- `organisations` ;
- `ressources` ;
- `referentiels` ;
- `pages` ;
- `accueil` ;
- `configurationSite`.

Utiliser les loaders officiels Astro, principalement `glob()`. Aucun loader personnalisé n'est introduit dans le POC.

Les collections récurrentes utilisent `glob()` sur leur dossier. Les singletons YAML `accueil.yaml` et `site.yaml` utilisent également un `glob()` ciblé sur leur fichier unique, plutôt que `file()`, car chaque fichier représente une seule entrée.

### Schémas et typage

Les schémas Zod sont explicites et constituent le contrat structurel des contenus.

Une **définition canonique** des règles locales doit être partagée entre Astro et l'outillage de validation. De fins adaptateurs Astro peuvent compléter cette définition pour les éléments propres au Content Layer, notamment les images et références. Ne pas dupliquer une règle métier dans deux implémentations indépendantes.

Utiliser les helpers Astro appropriés, notamment pour les images locales et les références typées lorsque cela améliore le typage. La validation transverse PPC reste néanmoins l'autorité sur l'intégrité globale du graphe de contenus.

### Accès applicatif

Les pages et composants passent par les API du Content Layer (`getCollection()`, `getEntry()` ou mécanismes équivalents de la version Astro retenue). Les contenus `publie: false` sont chargés et validés mais filtrés avant toute exposition publique.

## Validation des contenus

La validation comporte trois niveaux distincts.

### Niveau 1 — Schémas locaux

Une règle qui peut être vérifiée avec une seule entrée appartient au schéma, par exemple :
- types, champs obligatoires, enums, formats d'URL et de slug ;
- contrat discriminé de `Ressource.mode_exposition` ;
- photo + LinkedIn requis selon les rôles publics d'une `Personne` ;
- cohérence de `Référentiel.version_courante` avec `versions[].id` au sein du même fichier ;
- cohérence locale image / `image_alt` lorsque applicable.

### Niveau 2 — Validateur transverse PPC

Un validateur TypeScript dédié contrôle ce qui nécessite plusieurs entrées ou l'état global du dépôt. Il réutilise la définition canonique des schémas et ne redéfinit pas les modèles.

Il couvre au minimum :
- existence des cibles de relations ;
- références publiques vers des contenus publiables ;
- sélections explicites vers des contenus `publie: true` ;
- unicité et collisions de slugs dans leurs espaces de routes ;
- existence réelle des documents locaux référencés sous `public/` ;
- cohérence des redirections et de leurs cibles ;
- conventions de noms de fichiers et identifiants lorsque vérifiables globalement.

Les erreurs sont **agrégées**, bloquantes et formulées de façon actionnable avec le chemin du fichier, l'identifiant concerné et la correction attendue. Éviter les warnings pour les règles normatives ; réserver les warnings aux recommandations réellement non bloquantes.

Le point d'entrée peut vivre dans `scripts/`, avec la logique réutilisable factorisée dans `src/` ou un module partagé. Le nom exact des fichiers reste un détail d'implémentation.

### Niveau 3 — Site construit

Après `astro build`, des contrôles vérifient les propriétés qui dépendent du rendu : routes, liens internes, sitemap, métadonnées et accessibilité automatisable. La stratégie est détaillée dans [`qualite-accessibilite-seo.md`](qualite-accessibilite-seo.md).

## Règles de visibilité

`publie` est un interrupteur d'exposition, pas un workflow.

Un contenu non publié :
- ne génère pas de route publique ;
- n'apparaît dans aucune liste ou sélection automatique ;
- n'apparaît pas dans le sitemap ou les métadonnées publiques.

Les sélections automatiques filtrent les contenus non publiés. Une référence éditoriale explicite destinée au public vers un contenu publiable non publié constitue une erreur de validation.

`Personne` et `Organisation` n'utilisent pas `publie`; leur visibilité est dérivée des rôles et relations.

## Routes et changements de slug

Les slugs sont stables après première publication. Un changement exceptionnel doit s'accompagner d'une redirection explicite conservée côté configuration technique du site.

Sur GitHub Pages, ces redirections sont générées statiquement par Astro ; elles ne doivent pas être présentées comme une garantie de réponse HTTP serveur 301. La configuration de redirection doit être testable et vérifier que la cible existe et qu'elle n'entre pas en conflit avec une route actuelle.

## Médias et documents

### Images

Les images éditoriales locales vivent dans `contenu/medias/images/`. Les champs de contenu référencent le fichier source ; Astro est responsable de leur import, de leur validation et de leur optimisation au build.

L'intégration initiale doit effectuer un smoke test de la chaîne :

```text
Decap → chemin média enregistré → Content Layer → image Astro optimisée
```

Ce test confirme la syntaxe précise des chemins relatifs et la configuration Decap, sans modifier l'architecture canonique.

### Documents

Les documents locaux téléchargeables vivent sous `public/documents/` et sont servis tels quels. Les contenus stockent leur chemin public explicitement. Le validateur transverse vérifie l'existence de tout fichier local référencé.

Les ressources tierces restent externes lorsque leur hébergement externe est naturel.

## Manipulation par scripts

Les contenus doivent pouvoir être créés ou mis à jour sans Decap.

Tout script écrivant dans `contenu/` doit :
- produire uniquement les formats canoniques ;
- réutiliser les schémas/validateurs du dépôt ;
- être idempotent autant que possible ;
- préserver les identifiants PPC existants ;
- n'importer que les données destinées au Web ;
- valider les données avant écriture lorsque cela est raisonnablement possible.

Les scripts modifient le **working tree** uniquement. Ils ne créent pas automatiquement de commit, ne poussent pas sur GitHub et ne fusionnent pas de branche. L'opérateur examine le `git diff` avant commit.

Aucun connecteur AssoConnect, HelloAsso ou autre SI associatif n'est implémenté dans le POC.

## Intégration DecapCMS

Decap lit et modifie les mêmes fichiers canoniques que le site. Sa configuration s'adapte aux modèles PPC et ne crée aucune structure propriétaire indispensable au rendu.

L'interface est disponible sous `/admin` et sa configuration mappe directement les collections et singletons décrits dans [`../contenu/contenu-et-cms.md`](../contenu/contenu-et-cms.md).

Le backend cible est `github`, branche `main`, en mode simple. Les utilisateurs Decap doivent posséder les droits GitHub leur permettant de pousser sur le dépôt.

## Authentification du CMS

L'architecture cible est :

**DecapCMS + backend GitHub direct + deux Netlify Functions OAuth minimales**.

Le dépôt étant public, le flux OAuth demande uniquement le scope GitHub nécessaire aux repositories publics, cible `public_repo`, sans scope général `repo` pour les dépôts privés.

### Rôle des fonctions

Les deux fonctions assurent uniquement le flux OAuth attendu par Decap :
- `/auth` : redirection vers l'autorisation GitHub ;
- `/callback` : échange du code temporaire contre le token puis retour du résultat à Decap.

Elles ne lisent ni n'écrivent les contenus, ne gèrent aucune base utilisateur, ne stockent aucun token durablement et ne participent jamais au rendu public.

### Secrets et sécurité

Les secrets OAuth restent exclusivement dans la configuration de secrets Netlify :
- `GITHUB_CLIENT_ID` ;
- `GITHUB_CLIENT_SECRET`.

La liste configurable des origines CMS autorisées est fournie à Netlify par `CMS_ALLOWED_ORIGINS`. Elle ne contient pas de secret, mais reste une configuration d'exploitation du service plutôt qu'un contenu éditorial ou une valeur injectée dans le build Astro.

Le secret n'est jamais commité, injecté dans le build Astro ou exposé côté client.

Le flux doit au minimum :
- utiliser et vérifier `state` ;
- limiter précisément l'URL de callback ;
- contrôler l'origine des échanges `postMessage` ;
- ne jamais journaliser les tokens ou secrets ;
- désactiver le cache sur les réponses sensibles ;
- fonctionner uniquement en HTTPS ;
- éviter un CORS permissif générique ;
- conserver des dépendances minimales.

L'implémentation actuelle complète ces exigences par PKCE S256 et corrèle le `state` à un cookie `Secure`, `HttpOnly`, `SameSite=Lax` de courte durée. Aucun CORS générique n'est ajouté : le retour inter-origines repose sur le protocole `postMessage` attendu par Decap et cible exclusivement l'origine validée.

Les permissions GitHub du repository restent l'autorité d'accès. Retirer l'accès GitHub d'un contributeur doit suffire à empêcher de nouvelles écritures via Decap.

**Git Gateway est explicitement exclu.** Netlify n'est utilisé que pour les deux fonctions OAuth ; le site reste hébergé sur GitHub Pages.

## Rich text et preview

Le widget `richtext` Decap est utilisé avec modes visuel et Markdown brut, limité au sous-ensemble Markdown PPC. Un smoke test de round-trip est obligatoire avant de considérer l'intégration CMS terminée.

La preview Decap reste légère et non pixel-perfect. Elle ne doit ni dupliquer le moteur de rendu Astro, ni imposer un framework client au site public, ni devenir un chemin critique du build.

## Workflow Git éditorial

Decap écrit directement sur `main` en mode simple :

```text
édition Decap
→ sauvegarde
→ commit sur main
→ GitHub Actions
→ validation/tests/build
→ déploiement seulement si tout réussit
```

Chaque sauvegarde déclenche donc la CI, y compris pour `publie: false`.

Le POC n'active pas `editorial_workflow`. La protection de branche ne doit pas imposer une Pull Request d'une manière qui empêcherait le fonctionnement normal de Decap pour les contributeurs autorisés.

Les conflits d'édition simultanée restent des conflits Git ordinaires ; aucun système PPC de fusion collaborative n'est construit.

Pour une refonte longue ou sensible d'un contenu déjà publié, une branche/PR peut être utilisée exceptionnellement hors du workflow Decap normal afin de conserver l'ancienne version publique jusqu'au merge.

Le rollback utilise Git (`revert` ou opération équivalente) puis repasse par la CI.

## CI/CD

GitHub Actions constitue la chaîne officielle de qualité, build et déploiement.

### Déclencheurs

- **push sur `main`** : validation + tests + build + déploiement ;
- **Pull Request** : même validation et build, sans déploiement production ;
- **schedule quotidien à 01:00, fuseau `Europe/Paris`** : validation + tests + build + déploiement ;
- **`workflow_dispatch`** : relance manuelle lorsque nécessaire.

Le build quotidien est une exigence fonctionnelle : les listes dérivées de la date courante, notamment les « prochains événements », doivent rester justes même en l'absence de commit récent. Le calcul reste au build plutôt que d'introduire une dépendance serveur ou du JavaScript client pour actualiser ces listes.

Sur un dépôt public, GitHub peut désactiver automatiquement les workflows planifiés après une longue période sans activité du dépôt. Cette limitation doit être documentée et surveillée en exploitation ; ne pas générer de faux commits uniquement pour contourner ce mécanisme.

### Jobs

Le workflow cible sépare au moins :

1. **qualité et build**, avec uniquement des droits de lecture : checkout, installation reproductible, validation des contenus, tests, contrôles Astro/TypeScript, build statique, contrôles du site généré, puis création de l'artefact Pages ;
2. **déploiement**, dépendant du premier job et seul détenteur des permissions GitHub Pages nécessaires.

Aucun artefact n'est déployé si un contrôle normatif échoue.

Les commandes utilisées dans la CI doivent être reproductibles localement. Le gestionnaire de paquets exact peut être choisi à l'implémentation, mais un seul gestionnaire et son lockfile doivent être committés.

## Sobriété, dépendances et design

Le site doit rester léger côté client comme en infrastructure :
- HTML statique par défaut et JavaScript client ciblé sur les interactions fonctionnelles ou UX qui le justifient ;
- pas de framework client par défaut ;
- dépendances limitées et justifiées ;
- images optimisées ;
- aucun tracker par défaut ;
- pas de fournisseur de polices externe par défaut ;
- polices système pour le POC ; si la future identité de marque impose une police spécifique, privilégier l'auto-hébergement si la licence le permet ;
- Tailwind CSS comme couche utilitaire de composition du POC, sans en faire la source de vérité de l'identité visuelle ;
- design tokens centraux dans `src/styles/tokens.css`, règles réellement globales dans `src/styles/global.css` et styles spécifiques scopés dans les composants Astro lorsque cela améliore la lisibilité ou exprime une logique propre au composant ;
- CSS produit limité aux règles réellement nécessaires au site.

Aucun budget chiffré arbitraire de JavaScript, poids de page ou score Lighthouse n'est fixé avant mesure de pages représentatives.

Tailwind et les composants Astro constituent le socle du POC. Aucune bibliothèque de composants UI n'est obligatoire. Bootstrap, Material UI, DaisyUI ou un design system tiers ne doit pas être ajouté uniquement pour accélérer des composants simples ; une bibliothèque spécialisée ne peut être réévaluée que face à un besoin réel.

Les règles détaillées de centralisation, responsive, langage graphique et réversibilité de la charte sont définies dans [`design-system.md`](design-system.md). Une future identité de marque doit pouvoir être appliquée principalement via les tokens, les assets d'identité et un petit nombre de primitives, sans réécriture page par page.

## Environnements

Pas de staging dédié initialement. Le développement et la vérification se font localement ; les Pull Requests peuvent fournir un contexte de validation sans devenir obligatoires pour l'édition courante.

## Analytics, cookies et vie privée

Aucun analytics dans le POC. Ne pas introduire indirectement de tracking via une dépendance. Réévaluer les implications juridiques lors de toute future intégration tierce.

## Navigateurs et terminaux

Support responsive mobile, tablette et desktop. Privilégier les standards Web éprouvés, l'amélioration progressive et la dégradation élégante. Le site doit rester utilisable sur des terminaux raisonnablement anciens et des connexions modestes sans maintenir indéfiniment des navigateurs réellement obsolètes. Les fonctions CSS récentes ne doivent pas conditionner l'accès au contenu ou à une fonction essentielle lorsqu'une solution plus simple et largement disponible suffit ; voir [`design-system.md`](design-system.md).

## Détails laissés à l'implémentation

Restent volontairement à l'implémentation :
- gestionnaire de paquets et lockfile correspondant ;
- noms exacts des modules TypeScript et organisation fine des helpers ;
- bibliothèque de tests et outils concrets de contrôle des liens/accessibilité ;
- YAML complet de Decap ;
- code exact des deux Netlify Functions ;
- CSS précis des previews ;
- formulation fine des messages d'erreur et de commit ;
- éventuels budgets quantifiés après mesure réelle.

Ces choix ne doivent pas modifier les contrats de données, le workflow, l'authentification ou le pipeline normés ci-dessus.
