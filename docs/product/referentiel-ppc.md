# Référentiel PPC — spécification produit, publication et consultation Web

## Statut

Spécification normative de la fonctionnalité **Référentiel PPC** du site.

Ce document formalise les décisions produit, éditoriales, techniques et de publication nécessaires pour :
- publier la version courante du Référentiel PPC sous forme Web ;
- conserver toutes les versions officielles en PDF ;
- garantir la fidélité entre la version Web et la version officielle publiée ;
- permettre un processus de publication reproductible et transmissible ;
- conserver la capacité technique d'accueillir plusieurs référentiels à l'avenir, sans exposer prématurément cette complexité dans l'interface.

Il complète notamment :
- `docs/product/architecture-information.md` ;
- `docs/product/exigences-fonctionnelles.md` ;
- `docs/contenu/contenu-et-cms.md` ;
- `docs/technique/architecture.md` ;
- `docs/technique/qualite-accessibilite-seo.md`.

En cas d'implémentation ou d'évolution de cette fonctionnalité, ces documents transversaux doivent être mis à jour pour rester cohérents avec la présente spécification.

---

## 1. Principes directeurs

### 1.1 Un Référentiel autonome dans le site

Le Référentiel PPC devient une rubrique autonome de premier niveau du site.

Le libellé de navigation principale est :

**Référentiel**

Le Référentiel ne doit plus être présenté comme un enfant de la rubrique **Marque collective**.

La rubrique **Marque collective** peut conserver des liens contextuels vers le Référentiel lorsqu'ils sont utiles à la compréhension, mais sans relation hiérarchique parent/enfant.

### 1.2 Une UI simple aujourd'hui, extensible demain

À ce stade, aucun autre référentiel n'est envisagé.

L'interface publique ne doit donc pas exposer artificiellement une logique de catalogue multi-référentiels.

La capacité technique à gérer plusieurs référentiels doit toutefois être préservée autant que raisonnablement possible, afin de permettre une évolution future sans remise à plat majeure.

### 1.3 Une seule version Web : la version courante

La version Web du Référentiel PPC correspond toujours à la **dernière version officielle publiée**.

Les anciennes versions ne sont pas consultables sous forme Web.

Elles restent :
- disponibles publiquement sous forme de PDF versionné ;
- récupérables côté sources via l'historique Git.

### 1.4 Fidélité stricte au document officiel

La version Web n'est **pas une adaptation éditoriale** du Référentiel.

Elle constitue une autre représentation de la même version officielle.

Le corps du Référentiel affiché sur le Web doit reprendre fidèlement :
- les mêmes titres ;
- les mêmes libellés ;
- les mêmes paragraphes ;
- les mêmes formulations ;
- le même ordre ;
- les mêmes listes ;
- les mêmes tableaux lorsqu'ils existent ;
- plus généralement, le même contenu textuel que la version officielle publiée.

Le site ne doit ni reformuler, ni résumer, ni enrichir le corps du Référentiel.

La couche Web peut uniquement ajouter des éléments d'interface autour du contenu officiel : navigation, table des matières, métadonnées de version, liens de téléchargement, ancres, contrôles de lecture, etc.

---

## 2. Architecture publique et routes

### 2.1 Navigation principale

Le Référentiel devient une entrée de premier niveau de la navigation principale, libellée :

**Référentiel**

L'ordre exact de la navigation globale doit être réévalué dans `docs/product/architecture-information.md`, mais le Référentiel doit être exposé au même niveau que les autres grandes rubriques du site.

### 2.2 Route `/referentiel`

`/referentiel` est la page d'entrée et de présentation du Référentiel PPC.

Tant qu'il n'existe qu'un seul référentiel, cette page doit être rédigée directement comme la page du **Référentiel PPC** et non comme un catalogue générique de référentiels.

Cette page est distincte du corps officiel du Référentiel.

Elle contient, dans cet ordre général :

1. l'identification de la version courante ;
2. un court texte éditorial de présentation ;
3. le sommaire des chapitres principaux ;
4. la section **Versions publiées**.

### 2.3 Route `/referentiel/ppc`

`/referentiel/ppc` est l'unique page de consultation Web de la version courante du Référentiel PPC.

Il n'existe pas une route publique distincte par chapitre.

Les chapitres et sous-sections sont accessibles par ancres, par exemple :

```text
/referentiel/ppc#introduction
/referentiel/ppc#conception-demontable
```

Les noms ci-dessus sont illustratifs : les ancres principales réellement retenues doivent être explicites et stables.

### 2.4 Suppression des anciennes routes

Les anciennes pages publiques de référentiels situées sous l'univers **Marque collective** doivent être supprimées.

Compte tenu de la jeunesse du site, aucune redirection spécifique n'est requise pour ces anciennes routes.

---

## 3. Page `/referentiel`

### 3.1 Métadonnées de la version courante

Le haut de page doit identifier clairement la version courante avec au minimum :
- numéro de version ;
- date de publication ;
- statut indiquant qu'il s'agit de la version actuelle ;
- accès direct au PDF correspondant.

### 3.2 Texte de présentation

Le texte de présentation de `/referentiel` provient du contenu situé **avant le chapitre 1** dans le document source officiel, notamment les blocs de préambule tels que **« Objet du document »** et **« Principe général »** lorsqu'ils existent.

Ce contenu :
- n'est pas intégré au Markdown du lecteur Web ;
- est utilisé pour alimenter la page principale de présentation du Référentiel ;
- doit être repris fidèlement depuis la version officielle courante ;
- reste distinct du corps du Référentiel consulté dans `/referentiel/ppc`.

La page `/referentiel` peut adapter uniquement la mise en forme nécessaire à l'interface, sans réécrire ni reformuler ce contenu.

### 3.3 Sommaire

La page affiche le sommaire complet des **10 chapitres principaux** de la version actuelle.

Chaque entrée renvoie directement vers l'ancre correspondante dans `/referentiel/ppc`.

Aucun traitement visuel additionnel spécifique des quatre piliers n'est requis dans cette première version : ils sont déjà visibles dans le sommaire.

### 3.4 Versions publiées

Une section **Versions publiées** est placée après le sommaire.

Elle liste toutes les versions officielles disponibles, y compris la version courante, avec au minimum :
- numéro de version ;
- date de publication ;
- lien vers le PDF versionné.

Aucun bloc « Dernières évolutions » ou changelog éditorial n'est requis à ce stade.

---

## 4. Lecteur Web `/referentiel/ppc`

### 4.1 Une seule page HTML

Le Référentiel courant est rendu dans **une seule page HTML**.

L'intégralité du contenu officiel est présente dans le document HTML généré.

La navigation entre chapitres ne déclenche pas de chargement de page ni de récupération dynamique d'un autre document.

### 4.2 Affichage d'un chapitre à la fois

Lorsque JavaScript est disponible, l'interface affiche un seul chapitre principal à la fois.

Les autres chapitres restent présents dans le DOM mais sont masqués par l'interface.

Lorsqu'un utilisateur sélectionne un autre chapitre :
- le contenu visible est remplacé par le chapitre sélectionné ;
- l'utilisateur est repositionné en haut de ce chapitre ;
- l'ancre de l'URL est mise à jour.

### 4.3 Chapitre affiché par défaut

Lorsque `/referentiel/ppc` est ouvert sans ancre, le chapitre 1 est affiché par défaut.

### 4.4 Niveau de navigation principal

Le niveau de navigation principal correspond aux **chapitres de niveau 1 du document officiel**, actuellement au nombre de 10 :

1. Introduction : comprendre la Pérennité Programmée Circulaire
2. Principes d'utilisation du référentiel
3. Pilier 1 : Conception démontable
4. Pilier 2 : Vente à l'usage
5. Pilier 3 : Organisation industrielle circulaire
6. Pilier 4 : Gestion par composants
7. Articulation systémique des quatre piliers
8. Évaluation d'une démarche PPC
9. Gouvernance et évolution du référentiel
10. Le référentiel comme bien commun

Les libellés affichés doivent toujours provenir du contenu officiel courant. Ils ne doivent pas être recopiés en dur dans l'interface.

### 4.5 Table des matières desktop

Sur desktop, la table des matières est affichée dans une colonne dédiée à gauche du contenu.

Elle présente :
- tous les chapitres principaux ;
- les sous-sections du chapitre actuellement affiché.

Les sous-sections des autres chapitres ne sont pas développées.

### 4.6 Table des matières mobile

Sur mobile, la colonne fixe est remplacée par un bouton ou panneau de sommaire adapté à l'espace disponible.

La logique de navigation reste identique :
- tous les chapitres principaux ;
- sous-sections développées uniquement pour le chapitre courant.

### 4.7 Navigation vers une sous-section

Un clic sur une sous-section :
- fait défiler le chapitre jusqu'à la sous-section correspondante ;
- met à jour l'ancre de l'URL ;
- permet de partager un lien direct vers cette sous-section.

### 4.8 Navigation précédent / suivant

Le bas de chaque chapitre affiche une navigation :
- chapitre précédent ;
- chapitre suivant.

Les libellés proviennent des titres officiels du Référentiel.

### 4.9 Métadonnées visibles dans le lecteur

Le lecteur doit rendre clairement visible :
- le numéro de version courante ;
- sa date de publication ;
- son statut de version actuelle ;
- un accès au PDF correspondant.

### 4.10 Fonctionnement sans JavaScript

Le lecteur doit être conçu en amélioration progressive.

Si JavaScript est désactivé ou échoue :
- l'intégralité du Référentiel reste visible ;
- les chapitres sont affichés les uns à la suite des autres ;
- les ancres restent utilisables ;
- le contenu demeure lisible et accessible.

Le JavaScript améliore l'expérience de lecture mais ne doit pas être nécessaire pour accéder au contenu.

---

## 5. Ancres et stabilité des liens

### 5.1 Chapitres principaux

Les chapitres principaux utilisent des ancres **explicites et stables**, découplées autant que possible de leur libellé courant.

Un changement de titre ne doit pas modifier automatiquement l'ancre historique d'un même chapitre logique.

Les ancres principales sont injectées ou associées automatiquement lors du processus d'import, à partir d'une table de correspondance maintenue dans le repo.

### 5.2 Sous-sections

Les ancres des sous-sections peuvent être générées automatiquement à partir de leurs titres dans cette première version.

Leur stabilité absolue entre versions n'est pas une exigence actuelle.

### 5.3 Source des libellés

Les titres visibles dans :
- le sommaire de `/referentiel` ;
- la table des matières du lecteur ;
- les liens précédent / suivant ;

doivent être dérivés automatiquement des titres du Markdown courant.

Aucun sommaire éditorial redondant ne doit être stocké séparément.

---

## 6. SEO et indexation

### 6.1 Pages indexables

Les pages suivantes sont indexables :
- `/referentiel` ;
- `/referentiel/ppc`.

### 6.2 URL canonique du lecteur

La canonical de la version Web du Référentiel est toujours :

```text
/referentiel/ppc
```

Les ancres ne constituent pas des pages SEO distinctes.

Ainsi, quelle que soit la section affichée ou partagée :

```text
/referentiel/ppc#introduction
/referentiel/ppc#conception-demontable
```

la canonical reste `/referentiel/ppc`.

### 6.3 Sitemap

Les routes `/referentiel` et `/referentiel/ppc` doivent être intégrées au sitemap conformément à la stratégie SEO globale du site.

Les ancres ne doivent pas créer d'entrées distinctes dans le sitemap.

---

## 7. Source de vérité et organisation des fichiers

### 7.1 Outil de travail collaboratif

Le travail éditorial collaboratif du Référentiel est réalisé dans **Google Docs**.

Google Docs est l'espace de rédaction, commentaire et collaboration.

Il n'est pas la source technique utilisée directement par le site.

### 7.2 Source technique publiée

Le **Markdown versionné dans Git** est la source de vérité technique de la version publiée sur le site.

La chaîne conceptuelle est :

```text
Google Docs
    ↓
export DOCX
    ↓
conversion semi-automatisée
    ↓
Markdown versionné dans Git
    ↓
rendu Web
```

### 7.3 Fichier Markdown courant

Pour cette première version de la fonctionnalité, le corps du Référentiel courant est stocké dans **un seul fichier Markdown**.

Emplacement cible :

```text
contenu/referentiels/ppc/
```

Le nom exact du fichier à l'intérieur de ce répertoire peut être fixé par l'implémentation, à condition qu'il soit unique, explicite et documenté.

Le fichier contient uniquement :
- le frontmatter technique nécessaire ;
- le corps officiel courant du Référentiel **à partir du chapitre 1 inclus**.

Tout contenu situé avant le chapitre 1 dans le document source officiel est exclu du Markdown du lecteur Web.

Ce préambule est utilisé séparément pour alimenter la page `/referentiel`.

### 7.4 Anciennes versions Markdown

Le repo ne conserve qu'un fichier Markdown actif correspondant à la version courante.

Les versions antérieures restent accessibles via l'historique Git.

Il n'est pas nécessaire de dupliquer les anciens Markdown dans une arborescence d'archives.

### 7.5 PDFs

Tous les PDFs officiels versionnés, y compris le courant, sont conservés dans :

```text
public/documents/referentiels/referentiel-ppc/
```

Les fichiers utilisent une convention de nommage explicite incluant le numéro de version.

La convention exacte doit être documentée et contrôlée automatiquement.

---

## 8. Métadonnées et historique des versions

### 8.1 Frontmatter du Markdown courant

Le frontmatter du fichier Markdown courant contient au minimum :
- numéro de version ;
- date de publication ;
- référence ou chemin vers le PDF correspondant.

Ces métadonnées sont fournies explicitement lors de la publication.

Le système ne doit pas tenter de déduire automatiquement la version ou la date depuis le texte du document.

### 8.2 Historique des versions

L'historique public des versions PDF reste géré dans le modèle de données prévu à cet effet.

Il est distinct du corps Markdown courant.

Le processus d'import doit mettre à jour automatiquement cet historique à partir des métadonnées explicites de la nouvelle version, sans créer de doublon.

---

## 9. Processus de publication

### 9.1 Principe

La publication d'une nouvelle version est un processus **semi-automatisé avec validation humaine**.

L'automatisation doit prendre en charge les opérations mécaniques et les contrôles répétitifs.

La validation finale de fidélité au document officiel reste humaine.

### 9.2 Séquence cible

Le processus cible est :

1. rédaction et collaboration dans Google Docs ;
2. validation de la nouvelle version par l'association ;
3. export manuel du Google Docs au format DOCX ;
4. ajout du PDF officiel versionné dans `public/documents/referentiels/referentiel-ppc/` ;
5. exécution d'une commande d'import documentée ;
6. extraction du préambule situé avant le chapitre 1 pour alimenter `/referentiel` ;
7. conversion en Markdown du contenu **à partir du chapitre 1 inclus** ;
8. écrasement du Markdown courant ;
9. injection ou maintien des ancres principales stables ;
10. écriture des métadonnées explicites de version ;
11. mise à jour automatique de l'historique des versions publiées ;
12. exécution des contrôles automatiques ;
13. vérification humaine du Markdown, du préambule de présentation et du rendu ;
14. commit et déploiement selon le processus normal du projet.

### 9.3 Commande unique

Le repo fournit une commande unique et documentée pour lancer l'import, par exemple conceptuellement :

```text
npm run referentiel:import -- <fichier.docx> ...
```

La syntaxe finale est un détail d'implémentation, mais la commande doit :
- être simple à exécuter ;
- prendre en entrée le DOCX ;
- recevoir explicitement les métadonnées nécessaires qui ne doivent pas être inférées ;
- produire ou remplacer le Markdown courant ;
- exécuter les transformations et contrôles prévus ;
- mettre à jour l'historique des versions.

### 9.4 Écrasement du Markdown courant

La commande peut écraser directement le fichier Markdown courant.

Git constitue le mécanisme de sauvegarde, comparaison et retour arrière.

Aucun fichier intermédiaire obligatoire n'est requis.

### 9.5 Transmissibilité

Le processus doit être utilisable par une personne qui n'a pas participé à sa conception.

Aucune étape essentielle ne doit dépendre :
- d'une connaissance implicite ;
- d'un outil personnel non documenté ;
- d'une manipulation non décrite ;
- d'un service détenu exclusivement par une personne.

La documentation doit permettre à un autre membre du projet de reprendre le processus de publication.

---

## 10. Conversion DOCX → Markdown

### 10.1 Dépendance de conversion

La conversion DOCX → Markdown doit s'appuyer sur une dépendance externe mature et reconnue plutôt que réimplémenter entièrement le parsing DOCX dans le projet.

La logique spécifique au Référentiel PPC reste dans le repo :
- nettoyage ;
- normalisation ;
- injection des ancres ;
- métadonnées ;
- validations ;
- mise à jour de l'historique.

Le choix précis de la dépendance appartient à l'implémentation et doit être justifié, maintenable et compatible avec le projet.

### 10.2 Fidélité

La conversion doit viser la conservation fidèle, **à partir du chapitre 1 inclus** :
- du texte ;
- de la hiérarchie des titres ;
- des paragraphes ;
- des listes ;
- des tableaux ;
- des emphases lorsqu'elles sont sémantiquement utiles ;
- des citations ou autres structures présentes dans la source officielle.

Tout contenu situé avant le chapitre 1 doit être exclu du Markdown du lecteur et traité comme préambule destiné à `/referentiel`.

Les éléments purement liés à la pagination PDF ou à la mise en page bureautique ne doivent pas polluer le Markdown.

### 10.3 Sommaire

Le script d'import ne stocke pas un sommaire séparé.

Le site reconstruit automatiquement le sommaire au build à partir de la structure de titres du Markdown courant.

---

## 11. Contrôles automatiques

### 11.1 Contrôles bloquants

Les contrôles structurants doivent arrêter l'import ou faire échouer la validation lorsque, par exemple :
- les métadonnées requises sont absentes ;
- le numéro de version est invalide ;
- la date de publication est absente ou invalide ;
- le PDF versionné correspondant est absent ;
- la version déclarée et le nom du PDF attendu sont incohérents ;
- la structure minimale de titres attendue n'est pas détectée ;
- les chapitres principaux nécessaires au lecteur ne peuvent pas être identifiés ;
- les ancres principales attendues ne peuvent pas être établies ;
- l'historique des versions ne peut pas être mis à jour de manière cohérente.

La liste exacte peut être enrichie lors de l'implémentation sans réduire ces garanties.

### 11.2 Comparaison Markdown ↔ PDF

Le processus doit tenter de détecter les divergences textuelles entre :
- le Markdown courant ;
- le PDF officiel de la même version.

La comparaison peut :
- extraire le texte du PDF ;
- normaliser les différences de pagination, espaces, césures et autres artefacts de rendu ;
- comparer le texte normalisé.

Cette comparaison est un **warning à examiner humainement**, et non un blocage automatique absolu, car certains écarts techniques peuvent être légitimes.

### 11.3 Exécution locale et CI

Les contrôles structurants doivent être exécutables :
- localement dans le workflow d'import ;
- automatiquement dans la CI lors des builds ou pull requests pertinentes.

L'objectif est qu'une incohérence détectable ne puisse pas être intégrée ou déployée uniquement parce que le contrôle local n'a pas été lancé.

---

## 12. Responsabilités du rendu Astro

Le rendu du site doit :

- charger le Markdown courant ;
- générer la page unique `/referentiel/ppc` ;
- conserver l'intégralité du corps officiel dans le HTML ;
- dériver automatiquement le sommaire depuis la structure du Markdown ;
- appliquer les ancres principales stables ;
- générer les ancres automatiques des sous-sections ;
- afficher un chapitre à la fois lorsque JavaScript fonctionne ;
- conserver un rendu intégral lisible sans JavaScript ;
- alimenter `/referentiel` avec les métadonnées de la version courante et les titres des chapitres ;
- alimenter la section **Versions publiées** depuis l'historique structuré ;
- ne jamais dupliquer manuellement les titres officiels dans les composants.

---

## 13. CMS et édition

Le Référentiel n'est pas un contenu éditorial ordinaire modifié directement dans DecapCMS.

Le workflow canonique de modification est :

```text
Google Docs → DOCX → import contrôlé → Markdown Git
```

L'implémentation doit éviter qu'une interface CMS générique puisse modifier directement et silencieusement le corps officiel du Référentiel en contournant ce workflow.

Les autres métadonnées ou contenus éditoriaux associés à `/referentiel` peuvent continuer à suivre les conventions générales du projet lorsqu'elles sont adaptées.

---

## 14. Documentation à maintenir

L'implémentation doit :

1. conserver ce document comme spécification dédiée de la fonctionnalité ;
2. documenter précisément le workflow de publication d'une nouvelle version ;
3. documenter la commande d'import et ses paramètres ;
4. documenter les conventions de nommage des PDFs ;
5. documenter les ancres principales et leur maintenance ;
6. documenter les contrôles bloquants et warnings ;
7. mettre à jour les documents transversaux impactés, notamment :
   - `docs/product/architecture-information.md` ;
   - `docs/product/exigences-fonctionnelles.md` ;
   - `docs/contenu/contenu-et-cms.md` ;
   - `docs/technique/architecture.md` ;
   - `docs/technique/qualite-accessibilite-seo.md` ;
   - les décisions d'architecture pertinentes si nécessaire.

La documentation doit être suffisamment précise pour qu'une autre personne puisse reprendre la publication du Référentiel sans dépendre d'explications orales.

---

## 15. Critères d'acceptation

La fonctionnalité est considérée comme conforme lorsque :

- [ ] **Référentiel** est une entrée autonome de la navigation principale.
- [ ] `/referentiel` présente directement le Référentiel PPC, sans UI de catalogue artificielle.
- [ ] `/referentiel/ppc` est l'unique page Web de lecture de la version courante.
- [ ] les anciennes pages de référentiels sous **Marque collective** sont supprimées.
- [ ] la rubrique **Marque collective** peut pointer contextuellement vers `/referentiel` sans le contenir hiérarchiquement.
- [ ] `/referentiel` affiche la version courante, sa date, son PDF, un texte bref, le sommaire et les versions publiées.
- [ ] le sommaire de `/referentiel` est dérivé du Markdown courant.
- [ ] le lecteur contient l'intégralité du Référentiel dans son HTML.
- [ ] avec JavaScript, un seul chapitre principal est affiché à la fois.
- [ ] sans JavaScript, l'intégralité du contenu reste visible et navigable.
- [ ] la table des matières desktop est positionnée à gauche.
- [ ] la navigation mobile fournit l'équivalent fonctionnel du sommaire.
- [ ] les sous-sections du chapitre courant sont visibles dans la table des matières.
- [ ] les liens de chapitre et sous-section mettent à jour l'ancre.
- [ ] un changement de chapitre replace la lecture en haut du nouveau chapitre.
- [ ] le chapitre 1 est affiché par défaut sans ancre.
- [ ] une navigation précédent / suivant existe.
- [ ] la version courante et le lien PDF sont visibles dans le lecteur.
- [ ] les titres visibles sont dérivés du contenu officiel et non dupliqués en dur.
- [ ] les ancres principales sont explicites et stables.
- [ ] les ancres des sous-sections sont générées automatiquement.
- [ ] `/referentiel` et `/referentiel/ppc` sont indexables.
- [ ] la canonical du lecteur reste `/referentiel/ppc` quelle que soit l'ancre.
- [ ] les routes pertinentes figurent dans le sitemap.
- [ ] un seul Markdown courant est utilisé comme source technique du corps officiel à partir du chapitre 1.
- [ ] le préambule situé avant le chapitre 1 est exclu du Markdown et alimente `/referentiel`.
- [ ] les anciennes versions Markdown ne sont pas dupliquées dans le repo.
- [ ] tous les PDFs versionnés restent dans `public/documents/referentiels/referentiel-ppc/`.
- [ ] les métadonnées de la version courante sont explicites dans le frontmatter.
- [ ] l'historique structuré des PDFs est maintenu séparément du corps Markdown.
- [ ] une commande unique permet l'import DOCX → Markdown.
- [ ] la commande met à jour automatiquement l'historique des versions.
- [ ] les contrôles structurants sont bloquants.
- [ ] la comparaison Markdown ↔ PDF génère un warning exploitable.
- [ ] les contrôles existent localement et en CI.
- [ ] le workflow complet de publication est documenté et transmissible.

---

## 16. Traitement du préambule avant le chapitre 1

Le contenu situé avant le chapitre 1 dans le document source officiel est traité comme **préambule de présentation** (en ignorant la table des matières).

Règle de publication :

- ce contenu est **ignoré lors de la génération du Markdown du lecteur** ;
- le fichier Markdown courant commence au chapitre 1 ;
- le préambule est extrait séparément lors de l'import ;
- il alimente la page `/referentiel` ;
- il ne crée aucun chapitre supplémentaire dans `/referentiel/ppc` ;
- il n'apparaît pas dans la table des matières du lecteur ;
- il doit rester fidèle au document source officiel courant.

Cette règle permet de conserver une séparation nette entre :
- la page de présentation du Référentiel (`/referentiel`) ;
- le corps officiel consultable (`/referentiel/ppc`).
