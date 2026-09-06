# Exigences fonctionnelles

## Statut

Spécification fonctionnelle du POC du site PPC. Elle décrit les comportements attendus du produit sans figer les détails d'implémentation du CMS ou des schémas techniques.

Les modèles de contenu normatifs sont détaillés dans [`../contenu/contenu-et-cms.md`](../contenu/contenu-et-cms.md). Le sitemap et le rôle des pages sont définis dans [`architecture-information.md`](architecture-information.md).

## Périmètre fonctionnel

| Fonction | Orientation POC |
|---|---|
| Gestion structurée des contenus via CMS | Requise |
| Actualités | Requises |
| Événements / agenda | Requis |
| Personnes et organisations réutilisables | Requises pour les usages publics du site |
| Ressources d'approfondissement | Requises, avec exposition hybride lien direct / page interne |
| Référentiels | Requis, avec historique éditorial structuré des versions |
| Pages institutionnelles éditables | Requises sous forme de singletons à structure imposée par le code |
| Paramètres éditoriaux globaux | Requis sous forme de singleton |
| Présentation de la marque collective | Requise |
| Contact | Page statique, sans formulaire runtime |
| Adhésion à l'association | Lien externe |
| Dons | Lien externe |
| Newsletter | CTA externe uniquement |
| Présentation de l'association et de sa gouvernance | Requise |
| Membres fondateurs | Page dédiée requise |
| Annuaire public complet | Non requis |
| Recherche sur le site | Non implémentée ; architecture compatible avec un ajout futur |
| Analytics | Non implémentés |
| Page 404 personnalisée | Requise |

## Gestion structurée et visibilité publique

Les contenus récurrents et les pages éditoriales fixes doivent pouvoir être modifiés par des contributeurs non techniques via le CMS, sans leur donner la capacité de reconstruire arbitrairement les pages.

Les contenus qui portent un état de visibilité utilisent un booléen léger `publie` :
- `publie: false` : le contenu peut exister dans Git mais ne doit pas être exposé publiquement ;
- `publie: true` : le contenu peut être exposé par le site s'il satisfait les autres règles de son modèle.

Cet état ne constitue ni un workflow d'approbation, ni un système de révisions, ni une version de travail d'un contenu déjà publié.

## Actualités

Exigences :
- hub commun `/actualites-evenements` ;
- détail sous `/actualites/<slug>` ;
- contenu structuré distinct des événements ;
- tri fondé sur la date de publication ;
- les anciennes actualités restent accessibles ;
- les actualités affichées sur la page d'accueil sont les **dernières actualités publiées**, sélectionnées automatiquement par le site ;
- aucun système de catégories, tags, auteur ou épinglage n'est requis dans le POC.

## Événements

Exigences :
- hub commun `/actualites-evenements` ;
- détail sous `/evenements/<slug>` ;
- distinction explicite entre événement organisé par PPC et événement externe auquel PPC participe ;
- possibilité de référencer des `Personne` et `Organisation` existantes ;
- caractère à venir / passé dérivé des dates, jamais saisi manuellement ;
- conservation des événements passés comme archive ;
- les prochains événements publiés affichés sur la page d'accueil sont sélectionnés automatiquement.

Le POC n'introduit pas de taxonomie détaillée de rôles événementiels sans besoin produit documenté.

## Personnes, organisations et gouvernance

`Personne` et `Organisation` sont des entités canoniques réutilisables pour les besoins publics du site. Elles ne constituent pas une copie exhaustive du SI associatif ni un annuaire public généraliste.

Exigences :
- une `Personne` peut référencer une `Organisation` ;
- une `Personne` peut porter plusieurs rôles PPC contrôlés ;
- les pages institutionnelles de gouvernance doivent dériver leur affichage des rôles des `Personne`, sans recopier les noms dans les pages ;
- un changement de co-présidence, de Conseil d'administration ou d'équipe opérationnelle doit pouvoir être reflété en modifiant les entités `Personne` concernées ;
- il n'existe pas de page publique générique `/personnes/<slug>` ou `/organisations/<slug>` dans le POC.

Pour les personnes exposées comme :
- co-présidence ;
- membre du Conseil d'administration ;
- membre fondateur ;

la photo et le lien LinkedIn sont requis dans le POC. Cette complétude doit pouvoir être contrôlée automatiquement.

### Membres fondateurs

Chaque membre fondateur présenté sur le site est une `Personne` portant le rôle `membre-fondateur`.

La route `/association/membres-fondateurs` est requise. La page doit présenter les membres fondateurs de manière visuelle, avec au minimum photo, nom et lien LinkedIn. La page `/association` présente synthétiquement le rôle du collège des membres fondateurs et renvoie vers cette page dédiée.

## Ressources

Les ressources d'approfondissement sont distinctes des référentiels normatifs.

Chaque `Ressource` choisit explicitement un mode d'exposition :

### Lien direct

La ressource renvoie directement vers :
- une URL externe ; ou
- un fichier local associé.

La destination directe est alors obligatoire.

### Page interne

La ressource dispose d'une page éditoriale durable sous :

`/ressources/<slug>`

Le slug et les éléments de contenu requis par la page interne sont alors obligatoires. Un lien principal associé peut renvoyer vers la vidéo, l'ouvrage, la publication ou le document d'origine.

La route `/ressources/<slug>` est donc facultative **par ressource**, et non obligatoire pour toutes les ressources.

### Accueil

Les ressources mises en avant sur la page d'accueil sont sélectionnées manuellement et ordonnées dans le singleton `Accueil`. Une `Ressource` ne porte pas de champ `mise_en_avant_accueil`.

## Référentiels et versions

Un `Référentiel` représente une identité durable rattachée canoniquement à l'univers Marque collective.

Exigences :
- liste sous `/marque-collective/referentiels` ;
- détail facultatif sous `/marque-collective/referentiels/<slug>` lorsqu'une page apporte une valeur réelle ;
- conservation explicite de plusieurs versions au sein du référentiel lorsque nécessaire ;
- chaque version dispose d'un identifiant stable ;
- `version_courante` désigne explicitement l'identifiant de la version courante ;
- la version courante ne doit jamais être déduite automatiquement de la date, du numéro ou de l'ordre de la liste ;
- les anciennes versions peuvent rester accessibles lorsque PPC le souhaite ;
- Git reste l'historique technique, distinct de cet historique éditorial.

Le site ne doit pas inventer de workflow d'approbation, de validation, d'attribution, de contrôle ou d'opposabilité non défini par PPC.

## Pages éditoriales fixes

Les pages institutionnelles et éditoriales fixes sont des singletons connus du code.

Leur contenu peut combiner :
- des champs structurés lorsqu'une information a une sémantique fonctionnelle ;
- du Markdown standard pour les textes éditoriaux ;
- des relations vers des collections structurées lorsque nécessaire.

La route, l'ordre général des sections, les composants et la logique de rendu restent dans le code. Le CMS ne permet pas de créer librement des pages ou de réordonner arbitrairement leur structure.

Les listes dérivables ne doivent pas être dupliquées dans ces pages : par exemple le Conseil d'administration provient des rôles des `Personne` et les référentiels de la collection `Référentiel`.

## Page d'accueil

La structure fonctionnelle de l'accueil est définie dans [`architecture-information.md`](architecture-information.md).

Règles de sélection des contenus :
- actualités : dernières actualités publiées, automatiquement ;
- événements : prochains événements publiés, automatiquement ;
- ressources : sélection manuelle et ordonnée dans le singleton `Accueil` ;
- textes et visuels éditoriaux utiles : modifiables via `Accueil` lorsque leur granularité le justifie ;
- structure des blocs et composants : code.

Aucun mécanisme d'épinglage des actualités ou événements n'est requis dans le POC.

## Paramètres éditoriaux globaux

Un singleton centralise uniquement les informations éditoriales transverses réellement susceptibles de changer sans développement, par exemple :
- adresse postale ;
- adresse e-mail publique ;
- réseaux sociaux ;
- URL d'adhésion ;
- URL de don ;
- URL de newsletter éventuelle ;
- autres liens externes globaux nécessaires.

La navigation, les routes, la configuration Astro et les paramètres techniques n'y sont pas stockés.

## Contact

Conserver un site statique.

La page Contact doit fournir :
- l'adresse postale de l'association ;
- une adresse e-mail de contact ;
- des indications sur les informations utiles à inclure dans l'e-mail selon la nature de la demande.

Ne pas ajouter de backend ou de service de formulaire externe uniquement pour proposer un formulaire de contact.

## Adhésion, dons et newsletter

Pour le POC :
- adhésion et dons utilisent de simples liens vers les services externes effectivement retenus par l'association ;
- la newsletter utilise un CTA vers une page ou un formulaire externe lorsqu'une solution existe ;
- le site ne réimplémente pas ces transactions ou inscriptions.

Toute intégration tierce supplémentaire doit rester proportionnée aux objectifs du site.

## Documents et médias

Le modèle de stockage est hybride :
- fichiers PPC légers, canoniques et utiles durablement au site : stockage possible dans le dépôt ;
- médias lourds ou contenus tiers naturellement hébergés ailleurs : URL externe.

Il n'existe pas de collection générique `Document` dans le POC. Un fichier est rattaché au contenu qui lui donne son sens, par exemple :
- PDF d'un référentiel → version du `Référentiel` ;
- livre blanc → `Ressource` ;
- statuts → page institutionnelle appropriée.

Le dépôt ne doit pas devenir une GED généraliste.

## Recherche

Aucune recherche dans le POC.

Les contenus et métadonnées doivent être structurés de façon à permettre ultérieurement l'ajout d'une recherche légère sans restructuration majeure.

## Analytics

Aucun analytics dans le POC.

L'architecture ne doit pas empêcher l'ajout futur d'une solution légère et respectueuse de la vie privée si l'équipe PPC décide que la mesure d'audience est utile.

## Prévisualisation éditoriale

Une prévisualisation pendant l'édition est souhaitable mais non obligatoire au fonctionnement du produit.

Pour le POC avec DecapCMS, la preview sert d'aide éditoriale. Elle n'a pas à reproduire pixel-perfect le rendu Astro et ne doit pas justifier une duplication importante de la logique de rendu ou une infrastructure disproportionnée.

## Gestion des erreurs

Prévoir une page 404 personnalisée, sobre et utile, compatible avec GitHub Pages.

Aucune migration exhaustive des redirections Odoo n'est requise.

## URL publiques

Les URL publiques importantes doivent être :
- simples ;
- sémantiques ;
- lisibles ;
- aussi stables que raisonnablement possible ;
- indépendantes du CMS ou des détails d'implémentation.

Exemples du sitemap retenu : `/association`, `/association/membres-fondateurs`, `/marque-collective`, `/marque-collective/referentiels`, `/ressources/<slug>` lorsqu'une ressource possède une page interne, `/actualites/<slug>`, `/evenements/<slug>`.
