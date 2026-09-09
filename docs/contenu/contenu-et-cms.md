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

Les routes et le rôle des pages sont décrits dans [`../product/architecture-information.md`](../product/architecture-information.md). L'organisation technique des collections, leur chargement par Astro, la validation et le pipeline sont détaillés dans [`../technique/architecture.md`](../technique/architecture.md).

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


## Organisation physique et formats canoniques

Les contenus canoniques sont stockés dans un répertoire **`contenu/` à la racine du dépôt**, distinct de `src/`. Cette séparation exprime trois responsabilités différentes :
- `contenu/` : données et textes éditoriaux canoniques ;
- `src/` : application Astro, schémas, règles de rendu et composants ;
- `public/` : fichiers servis tels quels, documents téléchargeables et interface `/admin`.

Les collections récurrentes sont **plates** : une collection correspond à un dossier et une entité à un fichier directement dans ce dossier. La date, la catégorie, le rôle ou toute autre taxonomie métier ne crée pas de sous-arborescence.

Répartition normative :

| Famille | Emplacement | Format canonique |
|---|---|---|
| Actualité | `contenu/actualites/` | Markdown `.md` + front matter YAML |
| Événement | `contenu/evenements/` | Markdown `.md` + front matter YAML |
| Personne | `contenu/personnes/` | YAML `.yaml` |
| Organisation | `contenu/organisations/` | YAML `.yaml` |
| Ressource | `contenu/ressources/` | Markdown `.md` + front matter YAML, corps éventuellement vide |
| Référentiel | `contenu/referentiels/` | Markdown `.md` + front matter YAML, corps éventuellement vide |
| Pages institutionnelles | `contenu/pages/` | Markdown `.md` + front matter YAML |
| Accueil | `contenu/pages/accueil.yaml` | YAML |
| Paramètres éditoriaux globaux | `contenu/configuration/site.yaml` | YAML |
| Images éditoriales | `contenu/medias/images/` | fichiers image sources |
| Documents téléchargeables | `public/documents/` | fichiers servis tels quels |

Le répertoire `contenu/pages/` reste plat et **ne reproduit pas les URL**. Le lien entre un singleton et sa route appartient au code Astro. La navigation structurelle appartient également au code, pas au singleton de configuration.

Les images et documents sont détaillés plus loin dans ce document et dans [`../technique/architecture.md`](../technique/architecture.md).

## Conventions transversales

### Identifiants stables et noms de fichiers

Pour toute entité représentée par un fichier, **le nom de fichier sans extension constitue l'identifiant PPC canonique et stable**. Aucun champ `id` redondant n'est stocké dans le fichier.

Exemples :

```text
contenu/personnes/christian-bruere.yaml        → id `christian-bruere`
contenu/organisations/atemis.yaml              → id `atemis`
contenu/ressources/livre-blanc-ppc.md          → id `livre-blanc-ppc`
contenu/referentiels/conception-ppc.md          → id `conception-ppc`
```

Les identifiants sont uniques dans leur collection, en ASCII minuscule et `kebab-case`. Ils ne dépendent ni du CMS, ni du slug public, ni d'un système externe. Une fois l'entité créée, l'identifiant est considéré comme immuable ; un renommage de fichier est une migration d'identifiant nécessitant la mise à jour explicite de ses relations.

Exception de nommage pour `Actualité` et `Événement` :

```text
YYYY-MM-DD-<identifiant-lisible>.md
```

Le préfixe `YYYY-MM-DD` correspond à la **date de création du fichier**. Il facilite le repérage humain dans Git et n'a aucune sémantique métier après création. Il n'est jamais resynchronisé avec `date_publication`, `date_debut` ou toute correction ultérieure de date.

Les sous-entités qui ne possèdent pas de fichier propre portent leur propre identifiant local. C'est notamment le cas des versions d'un `Référentiel`.

### Slugs et pérennité des URL

Le `slug` public est distinct de l'identifiant canonique. Modifier un slug ne modifie donc pas les relations internes.

Après première publication, un slug est considéré comme stable. Un changement reste possible lorsqu'il est justifié, mais il doit s'accompagner d'une **redirection explicite** de l'ancienne URL vers la nouvelle, conservée dans la configuration technique du site. L'historique des slugs n'est pas stocké dans les contenus.

### Relations

Une relation stocke l'identifiant canonique de la cible, pas son nom affiché ni son slug public.

Exemple :

```yaml
organisation: atemis
personnes_liees:
  - christian-bruere
  - stephanie-flacher
```

Le type de la relation est défini par le schéma du champ. Une relation multiple est une liste YAML ordinaire d'identifiants.

L'existence des cibles, les références cassées et les contraintes de visibilité sont vérifiées automatiquement par la validation du dépôt. Decap peut afficher des libellés humains tout en enregistrant ces identifiants.

### Visibilité publique

`Actualité`, `Événement`, `Ressource` et `Référentiel` utilisent un booléen :

```yaml
publie: false
```

ou :

```yaml
publie: true
```

`publie` est uniquement un **interrupteur d'exposition publique**. Il ne constitue ni workflow éditorial, ni historique métier, ni système de révisions.

Tous les contenus sont chargés et validés, y compris avec `publie: false`. Un contenu non publié :
- ne génère aucune page publique ;
- est absent des listes et sélections automatiques ;
- est absent des flux éventuels, du sitemap et des métadonnées SEO publiques.

Les sélections automatiques filtrent silencieusement les contenus non publiés. En revanche, une **sélection ou relation éditoriale explicite destinée à être rendue publiquement** ne peut pas pointer vers une entité publiable ayant `publie: false` : cette incohérence doit bloquer la validation.

`Personne` et `Organisation` n'ont pas de champ `publie`. Leur simple existence dans le dépôt ne crée ni page ni annuaire. Leur exposition est dérivée des rôles et relations effectivement utilisés par les pages du produit.

### Markdown PPC

Les corps éditoriaux utilisent un sous-ensemble volontairement restreint de Markdown standard :
- paragraphes ;
- titres `H2`, `H3` et `H4` ;
- gras et italique ;
- liens ;
- listes à puces ;
- listes numérotées ;
- citations ;
- images avec texte alternatif lorsque nécessaire.

Le `H1` appartient au template Astro et ne doit pas être saisi dans le corps éditorial.

Ne pas introduire dans le POC :
- HTML brut éditorial ;
- MDX ;
- composants ou shortcodes dans le corps ;
- tableaux Markdown ;
- notes de bas de page ;
- blocs de code ;
- `H5`/`H6` ;
- syntaxe propriétaire Decap ;
- page builder ou système générique de blocs.

Lorsqu'un rendu spécifique est nécessaire, préférer **champ structuré dédié + composant dans le code**.

## Modèles de contenus structurés

Dans les tableaux ci-dessous, « identifiant stable » désigne la propriété canonique dérivée du nom de fichier ; **ce n’est pas un champ à stocker dans le YAML/front matter**.

### Actualité

**Rôle :** publication éditoriale individuelle, distincte d'un événement mais présente dans le hub commun Actualités & événements.

**Exposition publique :**
- hub : `/actualites-evenements` ;
- détail : `/actualites/<slug>`.

| Champ | Statut | Règle |
|---|---|---|
| Identifiant stable (nom de fichier) | obligatoire | Identifiant PPC durable, indépendant du CMS |
| Titre | obligatoire | Titre visible et base du titre SEO |
| Slug | obligatoire | URL stable après publication initiale |
| Résumé / chapô | obligatoire | Cartes, hub et métadescription par défaut |
| Date de publication | obligatoire | Sert au tri |
| Date de mise à jour | facultatif | Seulement si utile publiquement |
| Image principale | facultatif | Aucune obligation d'illustrer chaque actualité |
| `image_alt` | facultatif | Renseigner lorsque l’image apporte une information utile ; peut rester vide si elle est décorative dans le contexte de rendu |
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
| Identifiant stable (nom de fichier) | obligatoire | Indépendant du CMS |
| Titre | obligatoire | |
| Slug | obligatoire | |
| Résumé | obligatoire | |
| Date/heure de début | obligatoire | |
| Date/heure de fin | facultatif | |
| Relation à PPC | obligatoire | `organise-par-ppc` ou `evenement-externe` auquel PPC participe |
| Lieu | facultatif | Texte simple |
| Lien externe | facultatif | Inscription, site organisateur, visioconférence, etc. |
| Image | facultatif | |
| `image_alt` | facultatif | Renseigner lorsque l’image apporte une information utile |
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
| Identifiant PPC stable (nom de fichier) | obligatoire | Indépendant de tout fournisseur externe |
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

Chaque `Personne` est stockée dans `contenu/personnes/<id>.yaml`. Le nom de fichier est son identifiant PPC canonique ; aucun champ `id` redondant n’est stocké.

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
| Identifiant PPC stable (nom de fichier) | obligatoire | Indépendant d'un fournisseur externe |
| Nom | obligatoire | |
| Site Web | facultatif | |
| Logo | facultatif | |
| Courte description | facultatif | Seulement lorsqu'elle est utile |
| Rôles PPC | facultatif, multiple | `partenaire` ou `mecene` uniquement pour le POC |

Pour le POC, le vocabulaire contrôlé de `Organisation.roles_ppc` est exactement :
- `partenaire` ;
- `mecene`.

Une `Organisation` peut ne porter aucun rôle PPC. Ce champ décrit uniquement les rôles publics transverses réellement portés par l'Organisation ; il ne représente pas une relation déjà modélisée ailleurs. Une Organisation liée à un Événement est référencée par `Événement.organisations_liees`. L'Organisation d'appartenance ou représentée par une Personne est référencée par `Personne.organisation`.

Aucune autre valeur, notamment `membre`, `utilisateur-marque`, `consortium`, `organisateur-evenement` ou `beneficiaire`, n'est introduite dans le POC sans besoin fonctionnel public explicite. Ce vocabulaire pourra être étendu ultérieurement si un nouveau besoin produit apparaît.

Une `Personne` peut référencer une `Organisation`.

Chaque `Organisation` est stockée dans `contenu/organisations/<id>.yaml`. Le nom de fichier est son identifiant PPC canonique ; aucun champ `id` redondant n’est stocké.

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

Chaque Ressource est stockée dans `contenu/ressources/<id>.md`, quel que soit son mode d'exposition. Une ressource en lien direct possède simplement un corps Markdown vide.

| Champ | Statut | Règle |
|---|---|---|
| Identifiant stable (nom de fichier) | obligatoire | Nom de fichier sans extension |
| Titre | obligatoire | |
| Type | obligatoire | Vocabulaire contrôlé |
| Origine | obligatoire | `ppc` ou `externe` |
| Résumé | obligatoire | |
| Image / vignette | facultatif | Image éditoriale locale lorsque pertinent |
| `image_alt` | facultatif | Renseigner lorsque l'image apporte une information utile |
| Date | facultatif | Seulement lorsqu'elle a un sens |
| Mode d'exposition | obligatoire | `lien-direct` ou `page-interne` |
| Destination directe | conditionnel | Requise uniquement en mode lien direct |
| Slug | conditionnel | Requis uniquement en mode page interne |
| Contenu éditorial | conditionnel | Corps Markdown facultatif en mode page interne, vide en lien direct |
| Lien principal associé | facultatif | Possible uniquement en mode page interne |
| `publie` | obligatoire | Visibilité publique |

#### Mode lien direct

Le clic principal renvoie directement vers une URL externe ou un fichier local.

Contrat :
- `destination_directe` : obligatoire ;
- `slug` : interdit ;
- `lien_principal_associe` : interdit ;
- corps Markdown : vide.

L'image, le titre, le résumé et les autres métadonnées peuvent néanmoins être utilisés pour produire une carte riche dans `/ressources` ou sur l'accueil.

#### Mode page interne

La Ressource possède une page durable sous `/ressources/<slug>`.

Contrat :
- `slug` : obligatoire ;
- `destination_directe` : interdite ;
- `lien_principal_associe` : facultatif ;
- corps Markdown : facultatif.

L'existence de la page dépend du mode et du slug, jamais de la présence d'un corps Markdown. Une page peut être utile avec ses seules données structurées et un lien principal associé.

#### Homepage

La sélection de ressources de la homepage est manuelle et ordonnée dans le singleton `Accueil`. Une Ressource ne porte pas de champ `mise_en_avant_accueil`. Toute Ressource explicitement sélectionnée pour l'accueil doit être publiée.

### Référentiel

**Rôle :** contenu normatif rattaché canoniquement à l'univers **Marque collective** et distinct des ressources d'approfondissement.

Le modèle du site n'invente aucune règle métier relative à l'attribution, la validation, le contrôle ou l'opposabilité des référentiels.

**Exposition publique :**
- liste : `/marque-collective/referentiels` ;
- détail facultatif : `/marque-collective/referentiels/<slug>`.

Chaque Référentiel est stocké dans `contenu/referentiels/<id>.md`. La présence du `slug` est le **signal canonique** indiquant qu'une page de détail existe. L'absence de slug signifie qu'aucune route de détail n'est générée, indépendamment de la présence éventuelle de Markdown.

Un `Référentiel` représente une identité durable contenant une liste structurée de versions. Une version n'est pas une collection autonome dans le POC.

Structure conceptuelle :

```yaml
titre: Référentiel exemple
slug: referentiel-exemple
version_courante: v1-2
versions:
  - id: v1-1
    version: "1.1"
    date_publication: 2026-05-10
    document: /documents/referentiels/referentiel-exemple/v1-1.pdf
  - id: v1-2
    version: "1.2"
    date_publication: 2026-09-01
    document: /documents/referentiels/referentiel-exemple/v1-2.pdf
publie: true
```

#### Champs au niveau du référentiel

| Champ | Statut | Règle |
|---|---|---|
| Identifiant stable (nom de fichier) | obligatoire | Nom de fichier sans extension |
| Titre | obligatoire | |
| Slug | facultatif | Sa présence crée la page de détail |
| Résumé | obligatoire | |
| Statut public | facultatif, lorsque pertinent | Ne pas confondre avec `publie` |
| Version courante | obligatoire dès qu'il existe des versions | Référence explicite vers `versions[].id` |
| Contenu de présentation | facultatif | Corps Markdown ; ne détermine jamais l'existence de la route |
| `publie` | obligatoire | Visibilité publique |

#### Champs d'une version

Une version peut comporter :
- `id` stable, unique à l'intérieur du Référentiel ;
- libellé / numéro `version`, distinct de l'identifiant technique ;
- date de publication lorsqu'elle est pertinente ;
- document principal local ou externe ;
- documents ou liens associés éventuels.

Règles :
- `version_courante` référence l'`id` stable d'une version, pas son libellé ;
- l'identifiant de version est stable même si son libellé éditorial évolue ;
- plusieurs versions peuvent être conservées explicitement ;
- la version courante n'est jamais déduite de l'ordre, du numéro ou de la date ;
- les anciennes versions peuvent rester accessibles lorsque PPC le souhaite ;
- Git reste l'historique technique, distinct de cet historique éditorial ;
- aucun workflow métier d'approbation n'est modélisé ;
- une évolution normative significative d'une version déjà publiée crée normalement une **nouvelle version** plutôt qu'un écrasement silencieux du document précédent.

Pour un document local, la convention privilégiée est :

```text
public/documents/referentiels/<id-referentiel>/<id-version>.<extension>
```

Le chemin reste néanmoins stocké explicitement dans la version ; il n'est pas reconstruit implicitement par le code. La validation vérifie que `version_courante` existe réellement et que tout document local référencé existe dans `public/`.

## Pages éditoriales fixes et singletons

### Principe hybride

Les pages institutionnelles et éditoriales fixes sont des **singletons connus du code**. Elles vivent dans `contenu/pages/`, sans reproduire l'arborescence des URL.

Leur modèle combine selon le besoin :
- quelques champs structurés lorsqu'une information possède une sémantique fonctionnelle ;
- un corps Markdown principal pour les parties narratives ;
- des relations vers les collections structurées.

La route, la composition générale, l'ordre des sections, les composants, la navigation et la logique de rendu restent dans le code. Le CMS ne permet pas de créer arbitrairement de nouvelles pages, de construire librement des sections ni de réordonner une page comme dans un page builder.

Les informations dérivables ne sont pas dupliquées :
- co-présidence, CA, représentants du vivant, équipe opérationnelle et membres fondateurs proviennent des rôles des `Personne` ;
- les référentiels proviennent de la collection `Référentiel`.

Un champ structuré supplémentaire n'est créé que lorsque le code a réellement besoin d'en connaître la sémantique ou le placement. Éviter de découper artificiellement chaque paragraphe ou section narrative en champs de front matter.

La page 404 reste dans le code pour le POC, sauf apparition ultérieure d'un besoin réel d'édition via CMS.

### Singleton `Accueil`

`Accueil` est stocké dans `contenu/pages/accueil.yaml` et possède un schéma dédié. Il pilote uniquement les contenus éditoriaux utiles de la homepage, sans devenir un page builder.

Règles :
- structure et composants des blocs : code ;
- textes et visuels éditoriaux pertinents : éditables lorsque nécessaire ;
- actualités : dernières actualités publiées, sélection automatique ;
- événements : prochains événements publiés, sélection automatique ;
- ressources : liste **manuelle et ordonnée de références vers `Ressource`** ;
- toute Ressource explicitement sélectionnée doit exister et être publiée.

Aucun mécanisme d'épinglage des actualités ou événements n'est introduit dans le POC.

### Singleton de paramètres éditoriaux globaux

Les paramètres éditoriaux globaux sont stockés dans `contenu/configuration/site.yaml`.

Ce singleton contient uniquement les informations transverses réellement éditoriales et modifiables sans développement, par exemple :
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

### Images éditoriales

Les images éditoriales locales vivent sous :

```text
contenu/medias/images/
```

avec des sous-dossiers lisibles par famille lorsque cela aide la reprise, par exemple `personnes/`, `organisations/`, `ressources/`, `actualites/`, `evenements/` et `referentiels/`.

Les contenus stockent une référence vers le **fichier source**, idéalement relative au fichier de contenu. Astro est responsable de l'import, de la validation et de l'optimisation de l'image au build.

Les noms de fichiers sources sont humains, en ASCII minuscule et `kebab-case`. Aucun UUID ou hash n'est imposé dans le patrimoine source ; Astro peut naturellement produire des fichiers optimisés fingerprintés dans `dist`.

### Documents téléchargeables

Les PDF et autres documents locaux qui doivent être servis tels quels vivent sous :

```text
public/documents/
```

Le contenu stocke leur URL publique explicite, par exemple :

```yaml
document: /documents/referentiels/conception-ppc/v1-2.pdf
```

Les ressources réellement externes restent des URL externes. PPC ne rapatrie pas automatiquement dans le dépôt des fichiers appartenant à des tiers.

### Politique de stockage hybride

| Contenu | Stockage par défaut |
|---|---|
| Photo d'une personne | `contenu/medias/images/personnes/` |
| Logo d'une organisation | `contenu/medias/images/organisations/` |
| Image d'actualité / événement | `contenu/medias/images/...` |
| Illustration éditoriale | `contenu/medias/images/...` |
| PDF d'un référentiel | `public/documents/referentiels/...` |
| Livre blanc PPC finalisé | `public/documents/ressources/...` lorsque servi localement |
| Vidéo hébergée sur une plateforme adaptée | URL externe |
| Formation ou ressource tierce | URL externe |

Aucune limite arbitraire de taille n'est fixée. Une alerte CI non bloquante pourra être ajoutée pour des sources manifestement volumineuses si les usages réels le justifient.

### Textes alternatifs

`Actualité`, `Événement` et `Ressource` disposent d'un champ `image_alt` facultatif. Il doit être renseigné lorsqu'une image apporte une information utile qui n'est pas déjà exprimée par le contexte ; il peut rester vide pour une image décorative.

`Personne.photo` et `Organisation.logo` n'ont pas de champ alt redondant : le rendu accessible est dérivé du nom de l'entité et du contexte d'utilisation. Le composant Astro reste responsable de choisir entre une alternative textuelle utile et `alt=""` lorsque l'image est décorative dans son contexte.

Les images insérées dans le corps Markdown portent leur alternative dans la syntaxe Markdown.

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

Decap est une interface d'édition au-dessus des fichiers du dépôt Git. Il ne devient ni la source canonique ni le propriétaire des contenus. Le site public doit continuer à fonctionner si Decap est supprimé.

L'interface CMS est servie sous `/admin`, depuis les fichiers dédiés placés dans `public/admin/`.

### Mapping des modèles PPC

La configuration Decap projette directement les modèles canoniques :

| Modèle PPC | Type Decap | Création de nouvelles entrées |
|---|---|---|
| Actualité | `folder collection` Markdown | oui |
| Événement | `folder collection` Markdown | oui |
| Personne | `folder collection` YAML | oui |
| Organisation | `folder collection` YAML | oui |
| Ressource | `folder collection` Markdown | oui |
| Référentiel | `folder collection` Markdown | oui |
| Pages institutionnelles | `file collection` | non |
| Accueil | `file collection` | non |
| Configuration éditoriale globale | `file collection` | non |

Aucune collection ou structure propre à Decap n'est ajoutée au modèle canonique.

Les relations Decap affichent un libellé humain mais stockent l'identifiant dérivé du nom de fichier, conceptuellement via `value_field: "{{slug}}"`. Les relations multiples sont enregistrées comme listes d'identifiants.

Pour les nouvelles entrées, Decap génère le nom de fichier à partir des champs humains sans exposer de champ `id` technique. Pour `Actualité` et `Événement`, le nom suit `YYYY-MM-DD-<slug>.md`, avec la date de création du fichier comme préfixe non métier.

### État `publie`

Pour les collections qui portent `publie`, une nouvelle entrée Decap utilise `publie: false` par défaut. Cela évite une exposition accidentelle au premier enregistrement sans introduire de workflow éditorial supplémentaire.

### Ressource et Référentiel

Pour `Ressource`, Decap présente les champs des deux modes avec des libellés et aides clairs. Aucun widget React PPC spécifique n'est introduit uniquement pour masquer dynamiquement des champs ; les schémas canoniques restent l'autorité sur les combinaisons permises.

Pour `Référentiel`, `versions` est représenté comme une liste structurée. `version_courante` saisit l'identifiant de la version explicitement désignée ; la validation garantit qu'il correspond à une entrée de `versions`. Ne pas déformer le modèle pour créer un sélecteur dynamique spécifique au CMS.

### Rich text

Le POC utilise le widget Decap **`richtext`**, avec modes visuel et Markdown brut, et une barre d'outils limitée au sous-ensemble Markdown PPC : H2-H4, gras, italique, liens, listes, citations et images.

Ne pas exposer les fonctions exclues par le contrat Markdown, notamment H1, H5/H6, blocs de code et constructions propriétaires.

Avant de considérer l'intégration éditoriale comme terminée, exécuter un **smoke test de round-trip** sur un corpus représentatif : ouverture, sauvegarde sans modification, modifications visuelles, bascule visuel ↔ brut, liens, titres, listes, citations, images/alt et caractères français. Le critère est la préservation sémantique et la lisibilité du diff Git, pas l'identité octet par octet.

Le widget `richtext` étant encore susceptible d'évoluer, épingler la version de Decap ayant passé ce smoke test plutôt que dépendre d'une version flottante.

### Médias dans Decap

La configuration médias doit permettre à Decap d'écrire les images dans `contenu/medias/images/...` tout en enregistrant dans les contenus une référence exploitable par Astro. Privilégier la configuration média au niveau collection lorsque cela simplifie les chemins relatifs.

Un **smoke test médias** doit vérifier au démarrage de l'implémentation la chaîne exacte Decap → chemin enregistré → Content Layer → optimisation Astro. Si une friction technique réelle apparaît, elle doit être résolue sans déformer les modèles fonctionnels.

### Preview

La preview Decap est une aide éditoriale légère et non pixel-perfect. Elle peut reproduire utilement : titre, résumé, image, métadonnées importantes, corps Markdown et lien principal lorsqu'il existe.

Elle ne doit pas dupliquer le header, footer, navigation, responsive exact, SEO ou toute la logique des données dérivées. Pour l'Accueil, les blocs automatiques peuvent être représentés par des indications simples plutôt que recalculés dans Decap.

La preview est prioritaire pour Actualité, Événement, Ressource, Référentiel et pages institutionnelles. Aucune preview spécifique n'est requise au départ pour Personne, Organisation ou la configuration globale.

Une régression mineure de preview ne doit pas bloquer le build public.

### Authentification

L'authentification utilise le **backend GitHub direct** de Decap et le composant OAuth défini dans [`../technique/architecture.md`](../technique/architecture.md) et [`../exploitation/exploitation.md`](../exploitation/exploitation.md).

Git Gateway n'est pas utilisé.

### Publication et branche Git

Decap utilise le mode simple et écrit directement sur `main`. Chaque sauvegarde produit un commit Git et déclenche la CI.

Le POC n'active pas `editorial_workflow`. `publie` reste la seule notion métier de visibilité.

Pour une modification courte d'un contenu déjà publié, le flux normal Decap convient. Pour une refonte longue ou sensible qui doit laisser l'ancienne version publique jusqu'à validation, utiliser exceptionnellement une branche Git et une Pull Request hors du workflow Decap normal plutôt que créer un double modèle de contenu.

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

## Détails laissés à l'implémentation

Les décisions structurantes de contenu et de CMS sont fermées. Restent volontairement au niveau de l'implémentation :
- noms exacts des modules TypeScript et factorisation interne des schémas ;
- YAML Decap complet et libellés fins de l'interface ;
- CSS précis des previews ;
- outil concret de tests et de contrôle des liens/accessibilité ;
- formulation exacte des messages de commit et erreurs de validation ;
- éventuels scripts futurs de synchronisation avec un SI associatif ;
- limites de taille des médias uniquement si des mesures réelles en démontrent le besoin.

Deux smoke tests font partie de la définition de terminé de l'intégration CMS :
1. round-trip `richtext` ↔ Markdown PPC ;
2. chemin média Decap ↔ `contenu/medias/images/` ↔ pipeline image Astro.

Ces tests ne rouvrent pas les modèles fonctionnels sauf contrainte réellement bloquante démontrée.
