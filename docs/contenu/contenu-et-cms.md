# Contenu et CMS

## Statut et rôle de ce document

Cette spécification est la référence normative principale pour la couche **contenu et édition** du POC du site PPC.

Elle définit :
- les principes de contenu ;
- les modèles structurés ;
- les singletons éditoriaux ;
- les relations entre contenus ;
- les règles de publication ;
- la politique Markdown et médias ;
- l'expérience éditoriale attendue ;
- DecapCMS comme CMS retenu pour le POC et les contraintes qui en découlent.

Les routes et le rôle des pages sont décrits dans [`../product/architecture-information.md`](../product/architecture-information.md). Les détails physiques des fichiers, schémas Astro et de la configuration Decap restent à préciser pendant la conception technique.

## Principes directeurs

1. Le CMS sert à **gérer des contenus**, pas à construire librement les pages.
2. La structure du site, les routes, les composants, le comportement et le design restent dans le code.
3. Les contenus restent dans Git, dans des formats simples, ouverts, lisibles et versionnés.
4. Le CMS est une **interface d'édition**, pas le propriétaire ni la base de données faisant autorité.
5. Les modèles de contenu sont indépendants du CMS. Si Decap et le modèle canonique PPC entrent en tension, Decap doit s'adapter au modèle, pas l'inverse.
6. Les mêmes contenus doivent pouvoir être lus et modifiés par Astro, par le CMS ou par des scripts.
7. Le POC évite la sur-modélisation : aucun champ ou mécanisme n'est ajouté sans besoin identifié.
8. La V1/POC est uniquement en français.
9. Les contenus éditoriaux longs utilisent du **Markdown standard et sobre**, sans MDX accessible aux contributeurs ni page builder.
10. Une information devient un champ structuré lorsqu'elle a une sémantique fonctionnelle pour le site ; sinon elle reste un contenu éditorial simple.

## Familles de contenus et de configuration

| Famille | Exemples | Pilotage cible |
|---|---|---|
| Contenus récurrents structurés | Actualités, événements, personnes, organisations, ressources, référentiels | CMS + fichiers versionnés dans Git |
| Pages éditoriales fixes | Comprendre la PPC, Association, Marque collective, Travailler avec nous, etc. | Singletons éditables via CMS ; structure dans le code |
| Paramètres éditoriaux globaux | Contact, réseaux sociaux, adhésion, don, newsletter | Singleton éditorial via CMS |
| Structure du produit | Routes, navigation, composants, logique de rendu, design, configuration Astro | Code uniquement |

Aucune collection générique `Document` ni système générique de blocs de page n'est introduit dans le POC.

## Conventions transversales

### Identifiants stables

Les entités structurées servant de cible de relation disposent d'un **identifiant PPC stable**, indépendant :
- du nom affiché ;
- du slug lorsqu'il peut évoluer ;
- de DecapCMS ;
- d'un outil associatif ou fournisseur externe.

Les relations utilisent ces identifiants stables ou le mécanisme équivalent retenu lors de l'implémentation.

### Visibilité publique

Lorsqu'un contenu porte un état de publication, il utilise un booléen léger :

```yaml
publie: false
```

ou :

```yaml
publie: true
```

`publie: false` permet de conserver un contenu dans Git sans l'exposer publiquement. Cet état ne constitue ni un workflow éditorial, ni un historique métier, ni un système de révisions d'un contenu déjà publié.

### Markdown

Les corps éditoriaux utilisent du Markdown standard. Les besoins minimums sont :
- paragraphes ;
- titres ;
- listes ;
- liens ;
- emphase ;
- citations ;
- images ;
- éventuellement séparateurs simples.

Ne pas introduire dans le POC :
- MDX accessible aux contributeurs ;
- composants arbitraires dans le corps des contenus ;
- système générique de blocs ;
- page builder.

Lorsqu'un rendu spécifique est nécessaire, préférer **champ structuré dédié + composant dans le code**.

## Modèles de contenus structurés

### Actualité

**Rôle :** publication éditoriale individuelle, distincte d'un événement mais présente dans le hub commun Actualités & événements.

**Exposition publique :**
- hub : `/actualites-evenements` ;
- détail : `/actualites/<slug>`.

| Champ | Statut | Règle |
|---|---|---|
| Identifiant stable | obligatoire | Identifiant PPC durable, indépendant du CMS |
| Titre | obligatoire | Titre visible et base du titre SEO |
| Slug | obligatoire | URL stable après publication initiale |
| Résumé / chapô | obligatoire | Cartes, hub et métadescription par défaut |
| Date de publication | obligatoire | Sert au tri |
| Date de mise à jour | facultatif | Seulement si utile publiquement |
| Image principale | facultatif | Aucune obligation d'illustrer chaque actualité |
| Texte alternatif | conditionnel | Requis lorsque l'image porte une information |
| Contenu | obligatoire | Markdown standard |
| `publie` | obligatoire | Visibilité publique |

Règles POC :
- pas de catégories, tags, auteur ou mécanisme d'épinglage sans besoin démontré ;
- la homepage affiche automatiquement les dernières actualités publiées ;
- les anciennes actualités restent accessibles.

### Événement

**Rôle :** rendez-vous daté, distinct d'une actualité.

**Exposition publique :**
- hub : `/actualites-evenements` ;
- détail : `/evenements/<slug>`.

| Champ | Statut | Règle |
|---|---|---|
| Identifiant stable | obligatoire | Indépendant du CMS |
| Titre | obligatoire | |
| Slug | obligatoire | |
| Résumé | obligatoire | |
| Date/heure de début | obligatoire | |
| Date/heure de fin | facultatif | |
| Relation à PPC | obligatoire | `organise-par-ppc` ou `evenement-externe` auquel PPC participe |
| Lieu | facultatif | Texte simple |
| Lien externe | facultatif | Inscription, site organisateur, visioconférence, etc. |
| Image | facultatif | |
| Contenu | obligatoire | Markdown standard |
| Organisations liées | facultatif, multiple | Références vers `Organisation` |
| Personnes liées | facultatif, multiple | Références vers `Personne` |
| `publie` | obligatoire | Visibilité publique |

Règles POC :
- le caractère à venir / passé est dérivé des dates, jamais saisi manuellement ;
- les événements passés restent accessibles comme archive ;
- la homepage affiche automatiquement les prochains événements publiés ;
- aucune taxonomie détaillée de rôles événementiels n'est introduite sans besoin documenté.

### Personne

**Rôle :** entité canonique représentant une personne publique utile au contenu du site.

`Personne` n'est pas la base exhaustive des adhérents de l'Association. Un éventuel SI associatif reste la source complète des données de membres ; le dépôt Web ne contient que les personnes et informations destinées à l'exposition publique du site.

**Exposition publique :** aucune page générique `/personnes/<slug>` dans le POC. Les personnes apparaissent dans les contextes qui les utilisent : gouvernance, membres fondateurs, événements, etc.

| Champ | Statut | Règle |
|---|---|---|
| Identifiant PPC stable | obligatoire | Indépendant de tout fournisseur externe |
| Prénom | obligatoire | |
| Nom | obligatoire | |
| Organisation | facultatif | Référence vers `Organisation` |
| Fonction dans l'organisation | facultatif | Texte libre, distinct d'un rôle PPC |
| Rôles PPC | facultatif, multiple | Vocabulaire contrôlé |
| Photo | facultatif dans le modèle général | Peut devenir obligatoire selon le contexte d'exposition |
| LinkedIn | facultatif dans le modèle général | Peut devenir obligatoire selon le contexte d'exposition |

Aucun champ biographique supplémentaire n'est ajouté sans besoin éditorial identifié.

#### Rôles PPC contrôlés

Liste initiale :
- `co-presidence`
- `conseil-administration`
- `conseil-administration-representant-vivant`
- `equipe-operationnelle`
- `membre-fondateur`
- `partenaire`
- `mecene`

Une personne peut porter plusieurs rôles simultanément. Les identifiants sont techniques et stables ; les libellés visibles sont pilotés par le site.

Pour le POC, `roles_ppc` décrit **la situation actuelle**. Aucun historique fonctionnel de mandat ou dates de début/fin n'est modélisé.

#### Complétude selon le contexte

Photo et LinkedIn sont requis dans le POC pour les personnes présentées comme :
- co-présidence ;
- membre du Conseil d'administration ;
- membre fondateur.

Ces contraintes doivent être contrôlées par les schémas ou le build lorsque le CMS ne les garantit pas suffisamment.

#### Stockage et automatisation

Le stockage cible est **un fichier structuré par entité**, de préférence YAML pour les données purement structurées. Le format et le chemin exacts restent à fixer lors de l'implémentation.

Ce choix doit permettre :
- des diffs Git lisibles ;
- des conflits localisés ;
- des champs facultatifs et listes naturelles ;
- des relations propres ;
- des créations et mises à jour simples par scripts ;
- une compatibilité avec un CMS Git-based.

Les scripts éventuels doivent pouvoir effectuer des mises à jour idempotentes. Les identifiants d'outils tiers peuvent servir à une synchronisation si un besoin réel apparaît, sans devenir l'identifiant canonique PPC.

### Organisation

**Rôle :** entité canonique réutilisable représentant une organisation utile au contenu public : organisation d'appartenance d'une personne, partenaire, mécène, organisation liée à un événement, etc.

**Exposition publique :** aucune page générique `/organisations/<slug>` ni rubrique d'annuaire organisations / partenaires dans le POC.

| Champ | Statut | Règle |
|---|---|---|
| Identifiant PPC stable | obligatoire | Indépendant d'un fournisseur externe |
| Nom | obligatoire | |
| Site Web | facultatif | |
| Logo | facultatif | |
| Courte description | facultatif | Seulement lorsqu'elle est utile |
| Rôles PPC | facultatif, multiple | Vocabulaire contrôlé lorsque pertinent |

Une `Personne` peut référencer une `Organisation`.

Comme pour `Personne`, le stockage cible est un fichier structuré par entité, facilement manipulable par le CMS ou par script ; le format et le chemin exacts restent à fixer.

### Membres fondateurs

Les membres fondateurs ne sont pas une liste textuelle séparée.

Règles :
- chaque membre fondateur présenté est une `Personne` ;
- il porte le rôle `membre-fondateur` ;
- photo et LinkedIn sont requis ;
- l'affichage public est visuel, de type portraits/cartes, et ne se limite pas à un tableau ou une liste de noms ;
- la page dédiée est `/association/membres-fondateurs` ;
- la page `/association` présente synthétiquement le rôle du collège des membres fondateurs et renvoie vers cette page.

### Ressource

**Rôle :** contenu d'approfondissement PPC, interne ou externe, distinct des référentiels normatifs.

Types initiaux contrôlés :
- `video`
- `ouvrage`
- `publication`
- `formation`
- `travail-ppc`
- `autre`

Origine :
- `ppc`
- `externe`

| Champ | Statut | Règle |
|---|---|---|
| Identifiant stable | obligatoire | |
| Titre | obligatoire | |
| Type | obligatoire | Vocabulaire contrôlé |
| Origine | obligatoire | `ppc` ou `externe` |
| Résumé | obligatoire | |
| Image / vignette | facultatif | |
| Date | facultatif | Seulement lorsqu'elle a un sens |
| Mode d'exposition | obligatoire | Lien direct ou page interne |
| Destination directe | conditionnel | URL externe ou fichier local pour le mode lien direct |
| Slug | conditionnel | Requis pour une page interne |
| Contenu éditorial | conditionnel | Markdown standard pour une page interne lorsque requis |
| Lien principal associé | facultatif | Vidéo, livre, publication ou autre source principale |
| `publie` | obligatoire | Visibilité publique |

#### Mode lien direct

Le clic principal renvoie directement vers une URL externe ou un fichier local. Une destination directe valide est obligatoire.

#### Mode page interne

La ressource possède une page durable sous `/ressources/<slug>`. Le slug et les éléments nécessaires au rendu de cette page sont obligatoires.

La route est facultative **par ressource**.

#### Homepage

La sélection de ressources de la homepage est manuelle et ordonnée dans le singleton `Accueil`. Une ressource ne porte pas de champ `mise_en_avant_accueil`.

### Référentiel

**Rôle :** contenu normatif rattaché canoniquement à l'univers **Marque collective** et distinct des ressources d'approfondissement.

Le modèle du site n'invente aucune règle métier relative à l'attribution, la validation, le contrôle ou l'opposabilité des référentiels.

**Exposition publique :**
- liste : `/marque-collective/referentiels` ;
- détail facultatif : `/marque-collective/referentiels/<slug>` lorsqu'une page apporte une valeur réelle.

Un `Référentiel` représente une identité durable contenant une liste structurée de versions. Une version n'est pas une collection autonome dans le POC.

Structure conceptuelle :

```yaml
id: referentiel-exemple
titre: Référentiel exemple
version_courante: v1-2
versions:
  - id: v1-1
    version: "1.1"
    date: 2026-05-10
  - id: v1-2
    version: "1.2"
    date: 2026-09-01
```

#### Champs au niveau du référentiel

| Champ | Statut | Règle |
|---|---|---|
| Identifiant stable | obligatoire | |
| Titre | obligatoire | |
| Slug | conditionnel | Si une page dédiée existe |
| Résumé | obligatoire | |
| Statut public | facultatif, lorsque pertinent | Ne pas confondre avec `publie` |
| Version courante | obligatoire dès qu'il existe des versions | Référence explicite vers `versions[].id` |
| Contenu de présentation | facultatif | Markdown standard si une page dédiée le nécessite |
| `publie` | obligatoire | Visibilité publique, sous forme d’état technique léger |

#### Champs d'une version

Le modèle reste minimal. Une version peut comporter :
- identifiant de version stable ;
- libellé / numéro de version ;
- date lorsqu'elle est pertinente ;
- document principal ;
- documents ou liens associés éventuels.

Règles :
- plusieurs versions peuvent être conservées explicitement ;
- `version_courante` est désignée explicitement ;
- elle n'est jamais déduite de l'ordre, du numéro ou de la date ;
- les anciennes versions peuvent rester accessibles lorsque PPC le souhaite ;
- Git reste l'historique technique, distinct de cet historique éditorial ;
- aucun workflow métier d'approbation n'est modélisé.

La cohérence de `version_courante` avec `versions[].id` doit être contrôlée au build.

## Pages éditoriales fixes et singletons

### Principe hybride

Les pages institutionnelles et éditoriales fixes sont des **singletons connus du code**.

Leur modèle combine selon le besoin :
- quelques champs structurés lorsqu'une information possède une sémantique fonctionnelle ;
- un ou plusieurs contenus Markdown pour les parties narratives ;
- des relations vers les collections structurées.

La route, la composition générale, les composants et la logique de rendu restent dans le code. Le CMS ne permet pas de créer arbitrairement de nouvelles pages, de construire librement des sections ni de réordonner une page comme dans un page builder.

Les informations dérivables ne sont pas dupliquées :
- co-présidence, CA, représentants du vivant, équipe opérationnelle et membres fondateurs proviennent des rôles des `Personne` ;
- les référentiels proviennent de la collection `Référentiel`.

L'exacte granularité des champs de chaque singleton est définie pendant l'implémentation selon la règle : **ne structurer que ce que le site a réellement besoin de comprendre**.

### Singleton `Accueil`

`Accueil` pilote uniquement les contenus éditoriaux utiles de la homepage, sans devenir un page builder.

Règles :
- structure et composants des blocs : code ;
- textes et visuels éditoriaux pertinents : éditables lorsque nécessaire ;
- actualités : dernières actualités publiées, sélection automatique ;
- événements : prochains événements publiés, sélection automatique ;
- ressources : liste **manuelle et ordonnée de références vers `Ressource`**.

Aucun mécanisme d'épinglage des actualités ou événements n'est introduit dans le POC.

### Singleton de paramètres éditoriaux globaux

Un singleton spécifique contient uniquement les informations transverses réellement éditoriales et modifiables sans développement, par exemple :
- adresse postale ;
- adresse e-mail publique ;
- réseaux sociaux ;
- URL d'adhésion ;
- URL de don ;
- URL de newsletter éventuelle ;
- autres liens externes globaux réellement nécessaires.

Il ne contient pas :
- routes ;
- navigation structurelle ;
- configuration Astro ;
- logique des composants ;
- paramètres techniques de build ou de déploiement.

## Documents et médias

### Pas de collection générique `Document`

Aucune collection générique `Document` n'existe dans le POC.

Un fichier est rattaché au contenu qui lui donne son sens :
- PDF d'un référentiel → version du `Référentiel` ;
- livre blanc → `Ressource` ;
- statuts → page institutionnelle appropriée ;
- document associé à une page → champ de cette page.

Le dépôt ne doit pas devenir une GED généraliste.

### Politique de stockage hybride

Orientation :
- fichiers PPC légers et canoniques → dépôt lorsque pertinent ;
- médias lourds ou contenus tiers naturellement hébergés ailleurs → URL externe.

Exemples :

| Contenu | Stockage par défaut |
|---|---|
| Photo d'une personne | dépôt |
| Logo d'une organisation | dépôt |
| Image d'actualité / événement | dépôt |
| Illustration éditoriale | dépôt |
| PDF d'un référentiel | dépôt |
| Livre blanc PPC finalisé | dépôt |
| Vidéo hébergée sur une plateforme adaptée | URL externe |
| Formation ou ressource tierce | URL externe |

Aucune limite arbitraire de taille n'est fixée à ce stade ; elle pourra être définie après mesure des volumes réels et des contraintes Git/GitHub Pages.

## SEO éditorial

Le POC n'introduit aucun champ d'override SEO spécifique.

Par défaut :
- titre du contenu → titre SEO ;
- résumé / chapô → métadescription ;
- image principale → image sociale lorsque pertinente ;
- URL → route canonique définie par le site.

Ne pas ajouter sans besoin réel des champs comme `titre_seo`, `description_seo`, `og_title` ou `og_description`.

## Expérience éditoriale attendue

Le CMS doit rester simple pour une petite équipe non technique. Les contributeurs ne manipulent pas Git dans leur usage courant.

### Actualité

Le contributeur crée l'actualité, renseigne ses champs et son contenu, peut la conserver avec `publie: false`, puis passe à `publie: true` pour l'exposer. La homepage sélectionne ensuite automatiquement les dernières actualités publiées.

### Événement

Le contributeur renseigne les dates, la relation à PPC, le lieu/lien et le contenu, relie éventuellement des personnes ou organisations puis publie. Le site détermine automatiquement si l'événement est à venir ou passé.

### Personne et Organisation

Le contributeur modifie les informations publiques utiles, sélectionne les rôles PPC contrôlés et les relations existantes. Un changement de gouvernance ne nécessite pas de modifier manuellement les pages institutionnelles.

### Ressource

Le contributeur choisit le type, l'origine et le mode d'exposition. Le CMS peut aider à distinguer les champs des deux modes, mais les limites ergonomiques du CMS ne doivent pas modifier le modèle canonique.

### Référentiel

Le contributeur ajoute une entrée dans `versions`, puis modifie explicitement `version_courante` lorsque nécessaire. Le CMS ne déduit jamais la version courante.

### Page institutionnelle

Le contributeur ouvre le singleton connu et modifie uniquement les champs et contenus éditoriaux prévus. Les listes dérivées d'autres collections ne sont pas recopiées dans la page.

## CMS retenu pour le POC : DecapCMS

### Positionnement

**DecapCMS est retenu pour le POC.**

Decap est une interface d'édition au-dessus des fichiers du dépôt Git. Il ne devient ni la source canonique ni le propriétaire des contenus.

Le site public doit continuer à fonctionner si Decap est supprimé. Astro et les scripts doivent continuer à lire et manipuler les mêmes fichiers.

### Couverture attendue

La configuration Decap devra représenter les modèles canoniques ci-dessus :
- collections structurées ;
- singletons ;
- relations simples et multiples ;
- listes ordonnées ;
- rôles multivalués contrôlés ;
- Markdown standard ;
- images et fichiers ;
- `publie: true/false`.

La configuration YAML exacte, les widgets exacts et les chemins physiques restent à définir pendant l'implémentation.

### Authentification

L'architecture cible est :

**DecapCMS + backend GitHub direct + petit composant OAuth dédié**.

Conséquences :
- les contributeurs CMS disposent des droits GitHub nécessaires sur le dépôt ;
- le composant OAuth sert uniquement à compléter le flux d'authentification GitHub ;
- il reste minimal, documenté et remplaçable ;
- il ne possède aucun contenu ;
- le site public n'en dépend pas à l'exécution.

**Git Gateway n'est pas retenu** pour cette architecture. L'hébergement et la technologie exacts du composant OAuth restent à définir lors de l'implémentation.

### Champs conditionnels et validations

Decap ne garantit pas de manière suffisamment générale toutes les contraintes conditionnelles du modèle, notamment pour `Ressource.mode_exposition`.

Décision :
- conserver le modèle canonique ;
- utiliser des libellés et aides éditoriales clairs ;
- garantir par les schémas ou le build les règles que le CMS ne peut pas imposer proprement.

Contrôles déjà requis :
- `Référentiel.version_courante` doit exister dans `versions[].id` ;
- photo et LinkedIn requis pour les rôles `co-presidence`, `conseil-administration` et `membre-fondateur` ;
- destination directe requise pour une Ressource en mode lien direct ;
- slug et éléments nécessaires à la page requis pour une Ressource en mode page interne.

Ne pas introduire un widget PPC spécifique sans nécessité démontrée.

### Rich text et round-trip Markdown

L'implémentation doit tester concrètement le widget rich text actuellement proposé par Decap et ses round-trips Markdown avant de le considérer comme fiable pour le POC.

Les tests doivent couvrir au minimum :
- ouverture d'un contenu existant ;
- modification ;
- enregistrement ;
- relecture du Markdown généré ;
- titres ;
- liens ;
- images ;
- citations ;
- listes.

Le résultat doit rester lisible, stable, sobre, compatible Astro et exempt de format propriétaire. Le choix exact du widget Decap reste une décision d'implémentation tant que ces tests ne sont pas réalisés.

### Preview

La preview Decap est une aide éditoriale souhaitable, pas une reproduction pixel-perfect du site Astro.

Ne pas dupliquer fortement le design ou la logique de rendu et ne pas introduire une infrastructure disproportionnée uniquement pour la preview. Une prévisualisation du vrai site après commit/build peut exister indépendamment.

### Publication et travail en cours

Le POC n'active pas par défaut un `editorial_workflow` complexe basé sur branches / Pull Requests.

L'état `publie` permet de préparer un nouveau contenu sans exposition publique, mais ne résout pas le cas d'une modification longue d'un contenu déjà publié dont l'ancienne version doit rester publique.

La procédure opérationnelle de ce cas reste à définir pendant l'implémentation/exploitation. Ne pas introduire un double système métier « version publiée + version de travail » dans les contenus.

## Réversibilité et alternative future

Les données ne doivent contenir aucune structure propriétaire, identifiant CMS, wrapper artificiel ou syntaxe spécifique à Decap qui compliquerait leur usage hors du CMS.

**Sveltia CMS** est l'alternative future crédible privilégiée si Decap devient insuffisant ou si Sveltia atteint un niveau de maturité jugé supérieur.

Un remplacement Decap → Sveltia devrait porter principalement sur :
- la configuration CMS ;
- l'authentification ;
- les widgets ;
- la preview ;
- les tests de compatibilité ;

et non sur une migration structurante des contenus.

Sveltia n'est pas un composant de l'architecture du POC.

## Points volontairement ouverts pour l'implémentation

Restent à définir sans rouvrir les modèles fonctionnels sauf contrainte réellement bloquante :
- chemins physiques exacts des collections et singletons ;
- extensions et formats exacts collection par collection ;
- schémas Astro définitifs ;
- configuration YAML Decap ;
- widgets Decap exacts ;
- technologie et hébergement du composant OAuth ;
- conventions de commits ;
- procédure détaillée des modifications longues d'un contenu publié ;
- scripts de synchronisation éventuels ;
- limites de taille des médias ;
- détails fins de la preview.
