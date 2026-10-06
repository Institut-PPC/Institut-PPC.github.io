# Exigences fonctionnelles

## Statut

Spécification fonctionnelle du site PPC en production. Elle décrit les comportements attendus du produit sans figer les détails d'implémentation du CMS ou des schémas techniques.

Les modèles de contenu normatifs sont détaillés dans [`../contenu/contenu-et-cms.md`](../contenu/contenu-et-cms.md). Le sitemap et le rôle des pages sont définis dans [`architecture-information.md`](architecture-information.md).

## Périmètre fonctionnel

| Fonction | Périmètre actuel |
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
| Adhésion à l'association | Pages locales, formulaires HelloAsso par période et liens directs de repli |
| Dons | Page locale, formulaire HelloAsso et lien direct de repli |
| Newsletter | CTA externe uniquement lorsqu’une destination est configurée |
| Présentation de l'association et de sa gouvernance | Requise |
| Membres fondateurs | Page dédiée requise |
| Annuaire public complet | Non requis |
| Recherche sur le site | Non implémentée ; architecture compatible avec un ajout futur |
| Analytics | Non implémentés |
| Éco-conception | Page publique dédiée et exigence transversale durable |
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
- aucun système de catégories, tags, auteur ou épinglage n’est requis dans le périmètre actuel.

## Événements

Exigences :
- hub commun `/actualites-evenements` ;
- détail sous `/evenements/<slug>` ;
- distinction explicite entre événement organisé par PPC et événement externe auquel PPC participe ;
- possibilité de référencer des `Personne` et `Organisation` existantes ;
- caractère à venir / passé dérivé des dates, jamais saisi manuellement ;
- conservation des événements passés comme archive ;
- les prochains événements publiés affichés sur la page d'accueil sont sélectionnés automatiquement.

Le site n'introduit pas de taxonomie détaillée de rôles événementiels sans besoin produit documenté.

## Personnes, organisations et gouvernance

`Personne` et `Organisation` sont des entités canoniques réutilisables pour les besoins publics du site. Elles ne constituent pas une copie exhaustive du SI associatif ni un annuaire public généraliste.

Exigences :
- une `Personne` peut référencer une `Organisation` ;
- une `Personne` peut porter plusieurs rôles PPC contrôlés ;
- les pages institutionnelles de gouvernance doivent dériver leur affichage des rôles des `Personne`, sans recopier les noms dans les pages ;
- la page Gouvernance ne répète pas sur chaque carte le rôle principal déjà fourni par le titre du bloc ; elle affiche les rôles complémentaires contrôlés, notamment `co-tresorier` (« Co-trésorerie ») et `conseil-administration-representant-vivant` (« Représentation du vivant »), et accepte leur cumul ;
- un changement de co-présidence, de Conseil d'administration ou d'équipe opérationnelle doit pouvoir être reflété en modifiant les entités `Personne` concernées ;
- il n'existe pas de page publique générique `/personnes/<slug>` ou `/organisations/<slug>`.

Pour les personnes exposées comme :
- co-présidence ;
- co-trésorerie ;
- membre du Conseil d'administration ;
- membre fondateur ;

un visuel et le lien LinkedIn sont requis. `placeholder-personne.webp` est accepté comme visuel normal lorsqu’aucune photo n’est disponible. Cette complétude doit pouvoir être contrôlée automatiquement.

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

La destination directe est alors obligatoire. Le slug, le lien principal associé et le corps Markdown ne sont pas utilisés dans ce mode.

### Page interne

La ressource dispose d'une page éditoriale durable sous :

`/ressources/<slug>`

Le slug est obligatoire. Le corps Markdown et le lien principal associé sont facultatifs : les champs structurés peuvent suffire à produire une page interne utile. La destination directe n'est pas utilisée dans ce mode. Un lien principal associé peut renvoyer vers la vidéo, l'ouvrage, la publication ou le document d'origine.

La route `/ressources/<slug>` est donc facultative **par ressource**, et non obligatoire pour toutes les ressources.

### Accueil

Les ressources mises en avant sur la page d'accueil sont sélectionnées manuellement et ordonnées dans le singleton `Accueil`. Une `Ressource` ne porte pas de champ `mise_en_avant_accueil`.

## Référentiel PPC et versions

Le Référentiel PPC est une rubrique autonome, distincte de la hiérarchie Marque
collective.

Exigences :
- page de présentation sous `/referentiel` ;
- version Web officielle courante sous `/referentiel/ppc`, dans une page HTML unique ;
- corps complet présent dans le HTML et lisible séquentiellement sans JavaScript ;
- amélioration progressive affichant un seul chapitre principal à la fois, avec sommaire, ancres et navigation précédent/suivant ;
- sommaire et libellés de navigation dérivés du Markdown courant ;
- un unique Markdown courant sous `contenu/referentiels/ppc/`, commençant au chapitre 1 ;
- préambule maintenu explicitement dans le frontmatter, préservé lors de l'import et présenté uniquement sur `/referentiel` ;
- conservation explicite de plusieurs versions PDF dans le frontmatter ;
- chaque version dispose d'un identifiant stable ;
- `version_courante` désigne explicitement l'identifiant de la version courante ;
- la version courante ne doit jamais être déduite automatiquement de la date, du numéro ou de l'ordre de la liste ;
- les anciennes versions restent accessibles en PDF ; Git conserve l'historique des anciennes versions Markdown ;
- import canonique par la commande documentée `npm run referentiel:import -- ...`, et non par DecapCMS ;
- contrôles structurants bloquants et comparaison Markdown ↔ PDF non bloquante avec revue humaine obligatoire.

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

Aucun mécanisme d'épinglage des actualités ou événements n'est requis dans le périmètre actuel.

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

Fonctionnement actuel :
- les routes `/association/adherer` et `/association/faire-un-don` présentent le contexte éditorial avant la transaction ;
- les formulaires d'adhésion et de don sont intégrés depuis HelloAsso, qui reste seul opérateur du formulaire et du paiement ;
- chaque widget conserve un lien direct vers le formulaire HelloAsso afin que le parcours reste possible si l'intégration ne charge pas ;
- la page d'adhésion accepte plusieurs périodes indépendantes et les présente dans des onglets accessibles, avec une seule période visible à la fois et la première active par défaut ; elle n'expose un widget que lorsqu'une URL certaine est configurée pour la période concernée ;
- la newsletter utilise un CTA vers une page ou un formulaire externe lorsqu'une solution existe ;
- le site ne réimplémente pas ces transactions ou inscriptions.

L'intégration HelloAsso reste isolée dans un composant réutilisable, sans framework client ni dépendance supplémentaire. Toute autre intégration tierce doit rester proportionnée aux objectifs du site.

## Documents et médias

Le modèle de stockage est hybride :
- fichiers PPC légers, canoniques et utiles durablement au site : stockage possible dans le dépôt ;
- médias lourds ou contenus tiers naturellement hébergés ailleurs : URL externe.

Il n'existe pas de collection générique `Document`. Un fichier est rattaché au contenu qui lui donne son sens, par exemple :
- PDF d'un référentiel → version du `Référentiel` ;
- livre blanc → `Ressource` ;
- statuts → page institutionnelle appropriée.

Le dépôt ne doit pas devenir une GED généraliste.

## Recherche

Aucun moteur de recherche interne n’est implémenté.

Les contenus et métadonnées doivent être structurés de façon à permettre ultérieurement l'ajout d'une recherche légère sans restructuration majeure.

## Éco-conception

La route `/eco-conception` présente publiquement la démarche appliquée au site, ses choix concrets et un indicateur externe daté. Elle ne présente ni cette démarche ni l'indicateur comme un label ou une certification. Elle est accessible depuis le pied de page et reste hors de la navigation principale.

L'éco-conception constitue une exigence transversale durable. Toute nouvelle fonctionnalité ou dépendance doit être évaluée non seulement selon son utilité fonctionnelle, mais également selon son coût en ressources, son poids, ses dépendances techniques, sa compatibilité dans le temps et son impact sur la maintenabilité du site.

## Analytics

Aucun analytics n’est implémenté.

L'architecture ne doit pas empêcher l'ajout futur d'une solution légère et respectueuse de la vie privée si l'équipe PPC décide que la mesure d'audience est utile.

## Prévisualisation éditoriale

Une prévisualisation pendant l'édition est souhaitable mais non obligatoire au fonctionnement du produit.

La preview Decap peut servir d’aide éditoriale. Les previews des collections sont actuellement désactivées dans la configuration ; elles ne sont pas nécessaires au fonctionnement du site. Elle n'a pas à reproduire pixel-perfect le rendu Astro et ne doit pas justifier une duplication importante de la logique de rendu ou une infrastructure disproportionnée.

## Gestion des erreurs

Le site fournit une page 404 personnalisée, sobre et utile, compatible avec GitHub Pages.

Aucune migration exhaustive des redirections Odoo n'est requise.

## URL publiques

Les URL publiques importantes doivent être :
- simples ;
- sémantiques ;
- lisibles ;
- aussi stables que raisonnablement possible ;
- indépendantes du CMS ou des détails d'implémentation.

Exemples du sitemap retenu : `/association`, `/association/membres-fondateurs`, `/marque-collective`, `/referentiel`, `/referentiel/ppc`, `/ressources/<slug>` lorsqu'une ressource possède une page interne, `/actualites/<slug>`, `/evenements/<slug>`.
