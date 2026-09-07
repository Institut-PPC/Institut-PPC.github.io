# Architecture de l'information

## Statut

Spécification normative de l'architecture de l'information du POC du site PPC.

Ce document formalise les arbitrages validés lors de la phase de conception de l'architecture de l'information. Il distingue explicitement :
- les **principes et décisions durables**, qui forment le socle à préserver sauf raison structurante ;
- les **hypothèses propres au POC**, qui doivent être testées et peuvent évoluer sans remettre en cause l'ensemble de l'architecture.

Il ne définit pas de règles métier de la Pérennité Programmée Circulaire, de la marque collective, du consortium ou de l'association qui ne seraient pas déjà documentées ailleurs.

## Principe directeur

Le site est d'abord **le site de la Pérennité Programmée Circulaire (PPC)**, et non celui de l'Association.

Il doit permettre une découverte progressive :

**comprendre PPC → approfondir → voir sa formalisation concrète → éventuellement contribuer / entrer en relation**

L'Association pour la Pérennité Programmée Circulaire doit être clairement identifiable comme l'organisation qui porte, protège et développe PPC et sa marque collective, mais elle reste un univers du site parmi d'autres.

## Sitemap du POC

```text
/
│
├── /comprendre-la-ppc
│
├── /marque-collective
│   └── /marque-collective/referentiels
│       └── /marque-collective/referentiels/<slug>   [si nécessaire]
│
├── /ressources
│   └── /ressources/<slug>   [uniquement pour les ressources avec page interne]
│
├── /actualites-evenements
│   ├── /actualites/<slug>
│   └── /evenements/<slug>
│
├── /association
│   ├── /association/gouvernance
│   ├── /association/membres-fondateurs
│   └── /association/nous-soutenir
│
├── /travailler-avec-nous
│
├── /contact
│
├── /mentions-legales
├── /politique-de-confidentialite
├── /accessibilite
│
└── /404
```

### Éléments volontairement absents du POC

Le POC ne comporte pas :
- de rubrique autonome « Consortium » ;
- de rubrique « Partenaires / Écosystème » ;
- de parcours autonome « Adopter la PPC » ;
- d'annuaire public complet ;
- de recherche sur le site.

L'organisation des contenus et les URL ne doivent toutefois pas empêcher l'ajout ultérieur de ces capacités sans remise à plat majeure.

## Navigation globale

### Navigation principale de l’en-tête

Ordre retenu pour le POC :

1. **Comprendre la PPC**
2. **Marque collective**
3. **Ressources**
4. **Actualités & événements**
5. **Association**

Un CTA distinct **Nous contacter** complète la navigation principale.

Le logo renvoie à l'accueil.

### Sous-menus

Les sous-menus sont présents dès le POC lorsqu'une rubrique possède de vraies pages filles.

**Marque collective** :
- Présentation ;
- Référentiels.

**Association** :
- Présentation ;
- Gouvernance ;
- Membres fondateurs ;
- Nous soutenir / adhérer.

**Comprendre la PPC** reste une entrée simple dans la navigation globale. Sa navigation interne éventuelle se fait par ancres dans la page elle-même.

### Navigation secondaire et pied de page

Le pied de page remplit une véritable fonction de navigation secondaire. Il doit notamment donner accès à :
- l'ensemble des grandes rubriques PPC utiles ;
- **Travailler avec nous** ;
- **Nous contacter** ;
- **Adhérer / faire un don** ;
- les pages de l'Association ;
- les documents institutionnels pertinents lorsqu'ils sont publiés ;
- les mentions légales ;
- la politique de confidentialité ;
- l'accessibilité.

Cette organisation permet de garder le soutien à l'Association facilement accessible sans en faire un CTA dominant de l’en-tête.

## Rôle des pages

### `/` — Accueil

Donner en quelques dizaines de secondes une intuition juste de PPC, puis orienter vers les principaux approfondissements et actions possibles.

L'accueil n'est ni un portail exhaustif ni une version condensée de toutes les autres pages.

### `/comprendre-la-ppc` — Comprendre la PPC

Grande page pédagogique et narrative destinée à expliquer PPC de manière progressive.

Principes fonctionnels :
- éviter un traitement excessivement textuel ou laborieux ;
- privilégier les schémas et illustrations ;
- utiliser animations ou vidéos uniquement lorsqu'elles apportent une valeur pédagogique réelle et restent cohérentes avec les exigences de sobriété, d'accessibilité et de performance ;
- proposer une navigation interne discrète par ancres lorsque la longueur de la page le justifie.

### `/marque-collective` — Marque collective

Expliquer :
- ce qu'est la marque collective ;
- son rôle et son lien avec PPC ;
- le rôle des référentiels qui la fondent ;
- ce qui est actuellement disponible et ce qui est encore en construction.

Ne pas inventer ni préfigurer comme acquis des mécanismes futurs d'attribution, d'audit, de candidature ou de contrôle tant que leurs règles métier ne sont pas documentées.

### `/marque-collective/referentiels` — Référentiels

Présenter les référentiels disponibles ou publiables du corpus normatif PPC.

Les référentiels appartiennent **canoniquement à l'univers de la Marque collective**, même s'ils peuvent être liés directement depuis d'autres pages lorsque cela sert un parcours utilisateur.

### `/marque-collective/referentiels/<slug>` — Détail d'un référentiel, si nécessaire

Présenter un référentiel individuel lorsque le simple lien vers un document ou une ressource ne suffit pas.

Cette route est optionnelle dans le POC : ne créer une page de détail que si elle apporte une valeur réelle de contexte, de métadonnées ou de navigation.

### `/ressources` — Ressources

Constituer le centre d'approfondissement PPC.

Cette page peut agréger des ressources internes et externes, par exemple le Grand Cours Sator, le livre de Christian Bruère, des vidéos, des publications ou des travaux PPC. Le POC utilise une organisation simple par grands types, sans moteur de recherche ni filtres avancés.

Le modèle est hybride :
- certaines ressources renvoient directement vers une URL externe ou un fichier local ;
- d'autres disposent d'une page éditoriale durable sur le site.

La décision est portée par chaque `Ressource` via son mode d'exposition. Les ressources et leur modèle sont spécifiés dans [`../contenu/contenu-et-cms.md`](../contenu/contenu-et-cms.md).

### `/ressources/<slug>` — Détail d'une ressource, selon son mode d'exposition

Présenter une ressource uniquement lorsque celle-ci a été configurée en mode **page interne** et qu'un contexte éditorial durable sur le site apporte une valeur réelle.

Cette route est facultative **par ressource**. Une ressource en mode lien direct ne génère pas de page de détail et renvoie directement vers sa destination.

### `/actualites-evenements` — Actualités & événements

Servir de point d’entrée unique pour suivre l'activité de PPC.

Les deux familles restent distinctes :
- une **actualité** est une publication éditoriale ;
- un **événement** est un rendez-vous daté.

PPC peut publier des événements externes auxquels elle participe. Les événements passés restent accessibles afin de constituer une archive de l'activité.

### `/actualites/<slug>` — Détail d'une actualité

Présenter une publication éditoriale individuelle et permettre, lorsque pertinent, de poursuivre vers une ressource ou une prise de contact.

### `/evenements/<slug>` — Détail d'un événement

Présenter les informations utiles sur un événement individuel. Les événements passés restent consultables comme archive ; leur présence ne doit pas dépendre de leur caractère à venir.

### `/association` — Association

Présenter :
- pourquoi l'Association pour la Pérennité Programmée Circulaire existe ;
- ce qu'elle fait ;
- son articulation avec PPC et la marque collective.

Cette page ne doit pas transformer l'Association en identité englobante du site.

### `/association/gouvernance` — Gouvernance

Présenter la gouvernance actuelle de l'Association.

Pour le POC :
- co-présidence et Conseil d'administration avec **photo, nom, rôle et lien LinkedIn** ;
- ces listes sont dérivées des entités `Personne` et de leurs rôles PPC contrôlés, sans duplication des noms dans le contenu de la page ;
- les représentants du vivant et autres rôles de gouvernance sont également dérivés des rôles lorsque leur présentation est requise.

Les règles de gouvernance elles-mêmes ne sont pas définies par le site : le contenu publié doit refléter les sources institutionnelles de l'Association.

### `/association/membres-fondateurs` — Membres fondateurs

Présenter le collège des membres fondateurs sur une page dédiée afin de ne pas surcharger la page Association ou la page Gouvernance.

Chaque membre fondateur présenté est une entité `Personne` portant le rôle `membre-fondateur`. La présentation publique doit inclure **photo, nom et lien LinkedIn** et prendre une forme visuelle de type portraits/cartes, et non une simple liste textuelle ou un tableau de noms.

La page `/association` présente synthétiquement le rôle du collège des membres fondateurs et renvoie vers cette page dédiée.

### `/association/nous-soutenir` — Nous soutenir / adhérer

Expliquer les possibilités de soutien à l'Association et orienter vers les services externes effectivement utilisés pour l'adhésion ou le don.

Le site ne réimplémente pas dans le POC les transactions gérées par ces services externes.

### `/travailler-avec-nous` — Travailler avec nous

Page importante mais volontairement **hors navigation principale**.

Elle s'adresse notamment aux entreprises et organisations susceptibles, dans l'état actuel du projet, de participer à la construction de PPC et de ses référentiels, notamment dans le cadre des travaux collectifs en cours.

La page doit :
- expliquer la nature générale des collaborations recherchées sans inventer de règles d'éligibilité ou de processus non documentés ;
- donner suffisamment de contexte avant la prise de contact ;
- orienter vers **Contact** pour poursuivre l'échange.

### `/contact` — Contact

Permettre une prise de contact simple sans formulaire ni dépendance runtime externe.

La page fournit :
- l'adresse postale de l'Association ;
- une adresse e-mail ;
- des recommandations sur les informations utiles à fournir selon la nature de la demande, notamment : information générale, contribution, partenariat, marque/référentiels, presse/intervention.

### `/mentions-legales` — Mentions légales

Porter les mentions légales du site. Le texte juridique final peut être complété avant la production ; la route fait partie de l'architecture du POC.

### `/politique-de-confidentialite` — Politique de confidentialité

Expliquer de manière claire les traitements de données applicables au site. Le contenu doit rester cohérent avec les fonctionnalités réellement implémentées et les éventuelles dépendances externes.

### `/accessibilite` — Accessibilité

Présenter les informations publiques relatives à l'accessibilité du site et, lorsque cela sera pertinent, l'état de conformité ou les moyens de signaler une difficulté. Le POC ne prétend pas à une certification formelle tant qu'elle n'a pas été réalisée.

### `/404` — Page introuvable

Fournir une sortie d'erreur sobre et utile, permettant de revenir vers des pages valides du site sans créer de cul-de-sac de navigation.

## Structure fonctionnelle de la page d'accueil

La structure suivante est l'**hypothèse fonctionnelle retenue pour le POC**. Le rôle général de la page d'accueil est durable ; l'ordre, la présence et la forme exacte de ses blocs ne le sont pas.

1. **Hero**
   - proposition PPC courte ;
   - visuel explicatif fort ;
   - CTA principal **Comprendre la PPC** ;
   - CTA secondaire **Travailler avec nous**.

2. **Pourquoi la PPC ?**
   - problème auquel PPC répond ;
   - traitement court et principalement visuel.

3. **L'idée PPC**
   - quelques principes fondamentaux ;
   - CTA vers la grande page pédagogique.

4. **Du concept à un cadre concret**
   - formalisation ;
   - référentiels ;
   - marque collective.

5. **Travailler avec nous**
   - travaux en cours ;
   - appel aux entreprises ou organisations souhaitant contribuer.

6. **Pour approfondir**
   - sélection manuelle et ordonnée de ressources, pilotée par le singleton `Accueil`.

7. **PPC en mouvement**
   - dernières actualités publiées, sélectionnées automatiquement ;
   - prochains événements publiés, sélectionnés automatiquement.

8. **Association / soutien**
   - présence plus discrète en bas de page.

L'implémentation doit permettre de déplacer, ajouter ou supprimer ces blocs sans refonte structurelle après les tests du POC.

La homepage n'est pas un page builder : sa structure et ses composants restent dans le code. Les contenus éditoriaux utiles sont pilotés par le singleton `Accueil`. Les Actualités et Événements ne portent aucun champ d'épinglage dans le POC ; les Ressources ne portent aucun champ `mise_en_avant_accueil`.

## Parcours utilisateurs principaux

Les parcours ci-dessous sont des outils de conception et de validation. Ils décrivent l'intention et les chemins attendus, pas des tunnels rigides : les liens contextuels peuvent proposer des variantes lorsque cela améliore la compréhension.

### P1 — Découvrir PPC

**Intention / persona**  
Personne ou organisation qui connaît peu ou pas PPC et souhaite comprendre rapidement le concept avant de décider si elle veut approfondir.

**Points d'entrée principaux**
- page d'accueil ;
- arrivée directe sur `/comprendre-la-ppc` depuis un moteur de recherche, un lien partagé ou une publication.

**Étapes attendues**
1. Obtenir une première intuition sur l'accueil.
2. Choisir **Comprendre la PPC**.
3. Parcourir la page pédagogique de manière linéaire ou par ancres.
4. Poursuivre éventuellement vers **Ressources**.

**CTA structurants**
- Comprendre la PPC ;
- Pour approfondir / Ressources, selon le contexte éditorial.

**Destination attendue**  
Une compréhension suffisante pour reformuler l'idée générale de PPC et identifier où approfondir.

**Variantes**
- entrée directe sur une ressource puis retour vers Comprendre la PPC ;
- poursuite vers Marque collective si l'utilisateur cherche la formalisation du concept ;
- poursuite vers Travailler avec nous ou Contact si une intention de contribution apparaît.

**Hypothèses POC à observer**
- efficacité du couple Accueil → Comprendre la PPC ;
- utilité et discrétion de la navigation par ancres ;
- capacité des éléments visuels à expliquer sans alourdir la page.

### P2 — Entreprise ou organisation souhaitant contribuer

**Intention / persona**  
Entreprise, organisation, institution ou autre acteur professionnel qui souhaite comprendre comment contribuer aux travaux PPC actuels avant de prendre contact.

**Points d'entrée principaux**
- accueil ;
- `/comprendre-la-ppc` ;
- lien direct vers `/travailler-avec-nous`.

**Étapes attendues**
1. Comprendre suffisamment PPC et le contexte des travaux.
2. Accéder à **Travailler avec nous**.
3. Lire les attentes générales de collaboration et le contexte disponible.
4. Aller vers **Contact**.
5. Envoyer un e-mail avec les informations adaptées à la demande.

**CTA structurants**
- Travailler avec nous ;
- Nous contacter.

**Destination attendue**  
Une prise de contact qualifiée, sans prétendre automatiser un processus de candidature ou d'éligibilité non défini.

**Variantes**
- entrée depuis une actualité, un événement ou une ressource ;
- passage par Marque collective / Référentiels si l'intérêt porte d'abord sur le cadre formel.

**Hypothèses POC à observer**
- pertinence de garder Travailler avec nous hors navigation principale ;
- capacité de la page à qualifier suffisamment l'intention avant le contact ;
- compréhension du lien avec les travaux collectifs en cours sans créer artificiellement une rubrique Consortium.

### P3 — Chercher le cadre formel de PPC

**Intention / persona**  
Personne ou organisation qui cherche les éléments formels ou normatifs associés à PPC et à la marque collective.

**Points d'entrée principaux**
- navigation principale **Marque collective** ;
- lien contextuel direct vers les Référentiels ;
- arrivée directe sur un référentiel depuis un lien partagé ou un moteur de recherche.

**Étapes attendues**
1. Accéder à **Marque collective**.
2. Comprendre le rôle de la marque et l'état de sa formalisation.
3. Accéder à **Référentiels**.
4. Ouvrir le document ou la page du référentiel concerné.

**CTA structurants**
- Voir les référentiels ;
- Consulter / télécharger le référentiel, selon son mode de publication.

**Destination attendue**  
Accès au document ou à l'information normative recherchée, avec un contexte suffisant pour comprendre sa place dans la marque collective.

**Variantes**
- accès direct à un référentiel depuis Ressources ou une autre page, tout en conservant son rattachement canonique à la Marque collective ;
- contact si l'utilisateur a une question sur la marque ou les référentiels.

**Hypothèses POC à observer**
- pertinence de Marque collective au premier niveau du menu ;
- nécessité réelle de pages de détail par référentiel ;
- clarté de la distinction entre ressources d'approfondissement et documents normatifs.

### P4 — Suivre l'activité de PPC

**Intention / persona**  
Personne déjà intéressée par PPC qui souhaite suivre les avancées, publications et rendez-vous.

**Points d'entrée principaux**
- bloc **PPC en mouvement** de l'accueil ;
- navigation principale **Actualités & événements** ;
- lien direct vers une actualité ou un événement.

**Étapes attendues**
1. Consulter la page centrale Actualités & événements ou un contenu mis en avant.
2. Choisir une actualité ou un événement.
3. Lire le détail.
4. Poursuivre éventuellement vers une ressource pertinente ou Contact.

**CTA structurants**
- Lire l'actualité ;
- Voir l'événement ;
- Ressource associée ou Nous contacter lorsque pertinent.

**Destination attendue**  
Compréhension de l'activité récente ou passée de PPC et possibilité d'approfondir ou d'entrer en relation.

**Variantes**
- arrivée depuis un réseau social ou un lien externe directement sur le détail ;
- consultation d'un événement passé comme archive de l'activité.

**Hypothèses POC à observer**
- lisibilité d'une page centrale unique regroupant deux types de contenus distincts ;
- lisibilité de la remontée automatique des dernières actualités publiées et des prochains événements publiés sur l'accueil.

### P5 — Connaître ou soutenir l'Association

**Intention / persona**  
Personne qui veut comprendre qui porte PPC, connaître sa gouvernance, adhérer ou apporter un soutien financier.

**Points d'entrée principaux**
- navigation principale **Association** ;
- bloc Association / soutien en bas de l'accueil ;
- pied de page ;
- liens directs vers Gouvernance, Membres fondateurs ou Nous soutenir / adhérer.

**Étapes attendues**
1. Accéder à **Association**.
2. Comprendre le rôle de l'Association par rapport à PPC et à la marque collective.
3. Selon l'intention :
   - consulter **Gouvernance** ;
   - consulter **Membres fondateurs** ;
   - ou ouvrir **Nous soutenir / adhérer**.
4. Pour un soutien ou une adhésion, poursuivre vers le service externe effectivement utilisé.

**CTA structurants**
- Voir la gouvernance ;
- Découvrir les membres fondateurs ;
- Nous soutenir / adhérer ;
- Adhérer / faire un don dans le pied de page ou les contextes appropriés.

**Destination attendue**  
Accès à l'information institutionnelle recherchée ou au service externe de soutien, sans faire de l'adhésion/don l'action dominante du site PPC.

**Variantes**
- accès direct à la gouvernance depuis un lien institutionnel ;
- passage par Contact pour une question ne relevant ni de l'adhésion ni du don.

**Hypothèses POC à observer**
- absence de CTA Adhérer / faire un don dans l’en-tête ;
- lisibilité de l'articulation entre Association, Gouvernance et page dédiée des membres fondateurs ;
- équilibre entre visibilité de l'Association et primauté de PPC dans l'identité globale du site.

## Règles d'architecture durables

Les règles suivantes doivent être considérées comme structurantes :

1. **PPC reste l'identité principale du site.** L'Association est clairement présentée mais ne doit pas englober conceptuellement toutes les rubriques.
2. **Chaque page doit avoir un rôle identifiable.** Ne pas créer une rubrique simplement « au cas où ».
3. **La navigation principale reste courte.** Les parcours transversaux s'appuient aussi sur des liens contextuels et une navigation secondaire utile.
4. **Les URL publiques sont sémantiques, lisibles, stables et indépendantes du CMS.**
5. **Les référentiels appartiennent canoniquement à l'univers de la Marque collective.** Des liens transversaux directs restent autorisés.
6. **Séparer les grandes natures de contenus.** En particulier : pédagogie PPC, contenus normatifs/référentiels, ressources d'approfondissement, vie institutionnelle de l'Association, actualités et événements.
7. **Structurer les contenus qui évoluent.** Les contenus récurrents ou appelés à être gérés par des contributeurs non techniques doivent rester compatibles avec les principes de contenu structuré et de portabilité du dépôt. Les listes institutionnelles dérivables, notamment la gouvernance et les membres fondateurs, sont produites à partir des entités canoniques plutôt que recopiées dans les pages.
8. **Ne pas inventer de règles métier PPC.** Une architecture peut prévoir l'évolution future d'un parcours sans définir à l'avance ses critères, statuts, processus ou droits.
9. **Préserver l'évolutivité sans sur-concevoir.** L'architecture doit permettre d'ajouter plus tard des parcours ou rubriques justifiés, sans implémenter aujourd'hui des structures spéculatives.
10. **Sobriété, accessibilité, performance et pérennité restent des contraintes transversales.** Les choix de navigation, de médias et d'interaction doivent respecter les spécifications techniques et qualité du dépôt.

## Hypothèses spécifiques au POC à tester

Les éléments suivants sont validés comme hypothèses de mise en œuvre du POC, mais doivent pouvoir être réévalués à partir des retours de la co-présidence et des premiers tests :

- présence de **Marque collective** au premier niveau du menu ;
- présence de **Ressources** au premier niveau du menu ;
- utilisation de sous-menus dès le POC ;
- absence de **Adhérer / faire un don** dans l’en-tête ;
- maintien de **Travailler avec nous** hors navigation principale ;
- navigation interne par ancres de **Comprendre la PPC** ;
- composition exacte et ordre des blocs de la page d’accueil ;
- absence d'une page autonome **Consortium** ;
- absence d'une page **Partenaires / Écosystème**.

Faire évoluer un de ces éléments à la suite d'un test ne constitue pas, à lui seul, une remise en cause du principe directeur ou des règles d'architecture durables.

## Frontière avec les phases suivantes

Cette spécification fixe l'architecture de l'information. Les modèles de contenu et le CMS retenu sont spécifiés dans [`../contenu/contenu-et-cms.md`](../contenu/contenu-et-cms.md), leur conception technique dans [`../technique/architecture.md`](../technique/architecture.md), et le design system dans [`../technique/design-system.md`](../technique/design-system.md).

Ce document d'architecture de l'information ne redéfinit donc pas les chemins physiques, formats de fichiers, la configuration Decap ou les règles visuelles détaillées, désormais normés ailleurs. Restent hors de son périmètre :
- le contenu éditorial final de chaque page ;
- les mécanismes métier futurs d'attribution, de candidature, de contrôle ou d'audit de la marque collective ;
- un éventuel parcours futur « Adopter la PPC ».
