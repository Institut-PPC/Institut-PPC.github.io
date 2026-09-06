# Architecture technique

## Statut

Spécification de l'architecture technique du POC du site PPC.

Elle fixe les principes et choix déjà stabilisés. Les chemins physiques des contenus, schémas Astro définitifs, configuration Decap et détails du composant OAuth restent volontairement à préciser lors de la conception technique et de l'implémentation.

## Socle technique

Le socle retenu est :

- **Astro** pour le site statique ;
- **GitHub** pour l'hébergement du dépôt et le versionnement ;
- **GitHub Pages** pour l'hébergement public ;
- **GitHub Actions** pour validation, build, tests de non-régression et déploiement ;
- **DecapCMS** comme interface d'édition du POC au-dessus des contenus Git.

Ne pas remettre ce socle en concurrence sans besoin PPC concret le justifiant.

## Architecture statique par défaut

Une raison majeure du choix statique est de minimiser :
- la surface d'attaque ;
- la complexité à l'exécution ;
- l'infrastructure ;
- la logique serveur ;
- les secrets ;
- la charge de maintenance.

Privilégier la génération statique et une approche HTML/CSS d'abord. Ajouter du JavaScript côté client uniquement lorsqu'il apporte une valeur utilisateur réelle.

Le site public ne dépend pas de DecapCMS ni du composant OAuth à l'exécution.

## Sobriété numérique par conception

La sobriété numérique est un principe technique central, cohérent avec les objectifs de pérennité de PPC.

Le site doit rester léger en ressources côté client comme en infrastructure, fonctionner correctement sur des terminaux raisonnablement anciens et des connexions modestes, et éviter les choix techniques favorisant inutilement le renouvellement matériel.

Conséquences pratiques :
- JavaScript client minimal ;
- dépendances limitées ;
- images optimisées ;
- pas de framework client lourd inutile ;
- pages statiques lorsque possible ;
- pas de tracking intrusif ;
- pas de services runtime gratuits ou inutiles.

Aucun budget de performance chiffré n'est fixé avant de disposer de pages représentatives. Mesurer avant de décider si des budgets explicites sont utiles.

## Dépendances tierces à l'exécution

**Le fonctionnement essentiel du site public ne doit pas dépendre de services tiers à l'exécution.**

Des dépendances externes restent acceptables au cas par cas lorsqu'elles :
- répondent à un besoin réel ;
- sont légères et compréhensibles ;
- apportent une valeur supérieure à leur coût en complexité et dépendance ;
- sont raisonnablement remplaçables ;
- n'empêchent pas l'accès aux contenus essentiels en cas de panne.

Le composant OAuth nécessaire à l'authentification Decap est une dépendance d'administration, pas une dépendance du site public.

## Données et architecture des contenus

Git est la source durable des contenus du site.

Les contenus canoniques doivent :
- être stockés dans des formats simples et ouverts ;
- rester lisibles et modifiables hors du CMS ;
- être consommables directement par Astro ;
- pouvoir être manipulés par scripts ;
- être versionnés avec le dépôt.

Les modèles normatifs sont définis dans [`../contenu/contenu-et-cms.md`](../contenu/contenu-et-cms.md).

### Organisation conceptuelle

L'architecture doit pouvoir représenter :
- collections récurrentes : Actualité, Événement, Personne, Organisation, Ressource, Référentiel ;
- singletons de pages éditoriales fixes ;
- singleton `Accueil` ;
- singleton de paramètres éditoriaux globaux.

Pour les entités canoniques comme `Personne` et `Organisation`, l'orientation retenue est un **fichier structuré par entité**, de préférence YAML pour les données purement structurées. Les extensions et chemins exacts ne sont pas fixés à ce stade.

Les contenus longs utilisent du Markdown standard. Aucun MDX éditorial, page builder ou collection générique `Document` n'est requis.

### Relations et identifiants

Les entités structurées servant de cibles de relation disposent d'identifiants PPC stables indépendants du CMS et des fournisseurs tiers.

L'implémentation doit préserver la lisibilité des relations et permettre leur validation automatisée sans lier le modèle à Decap.

## Validation des contenus

Les schémas Astro et/ou les contrôles de build doivent garantir les contraintes que le CMS ne peut pas assurer suffisamment.

Ils doivent notamment permettre de contrôler :
- la conformité des contenus à leurs modèles ;
- la cohérence des références entre entités ;
- la complétude requise de certaines `Personne` selon leurs rôles ;
- la cohérence de `Référentiel.version_courante` avec `versions[].id` ;
- les champs requis selon le `mode_exposition` d'une `Ressource` ;
- les règles de qualité éditoriale documentées lorsque leur automatisation est fiable.

Les schémas exacts, messages d'erreur et détails de validation seront définis lors de l'implémentation.

## Manipulation par scripts

Les contenus, en particulier `Personne` et `Organisation`, doivent pouvoir être créés ou mis à jour sans DecapCMS.

Flux conceptuel possible :

```text
SI associatif / source externe
        ↓
normalisation / filtrage des données publiques
        ↓
modèle canonique PPC du site
        ↓
écriture / mise à jour de fichiers structurés
        ↓
Git
```

Les scripts éventuels doivent privilégier des mises à jour idempotentes et ne synchroniser que les données destinées au Web. Le dépôt du site ne doit pas devenir une base exhaustive des adhérents.

Aucun script de synchronisation concret n'est défini à ce stade.

## Intégration DecapCMS

DecapCMS est l'interface d'édition retenue pour le POC.

Principes :
- Decap lit et modifie les mêmes fichiers canoniques que le site ;
- la configuration du CMS doit s'adapter aux modèles PPC ;
- aucune structure propriétaire Decap ne doit devenir nécessaire au fonctionnement du site ;
- supprimer ou remplacer Decap ne doit pas nécessiter de migration structurante des contenus.

La configuration exacte des collections, file collections, widgets, relations, médias et previews reste à écrire après fixation des chemins, formats et schémas.

## Authentification du CMS

L'architecture cible est :

**DecapCMS + backend GitHub direct + petit composant OAuth dédié**.

Règles :
- les contributeurs CMS disposent des droits GitHub nécessaires sur le dépôt ;
- le composant OAuth complète uniquement le flux d'authentification GitHub ;
- il doit rester minimal, documenté et remplaçable ;
- il ne stocke ni ne possède les contenus ;
- il ne doit jamais devenir une dépendance runtime du site public ;
- ses secrets ne sont jamais exposés côté client ni committés dans le dépôt.

**Git Gateway n'est pas retenu** pour la nouvelle architecture.

La technologie, l'hébergement, le déploiement et la gestion exacte des secrets du composant OAuth restent à définir.

## Sécurité

Privilégier une **sécurité par simplicité architecturale**, pas des mécanismes de sécurité maison.

Principes :
- minimiser les services exposés et la logique runtime ;
- minimiser les secrets ;
- ne jamais exposer d'identifiants ou secrets côté client ;
- limiter les droits des contributeurs au strict nécessaire ;
- s'appuyer sur les mécanismes éprouvés de GitHub et des services retenus ;
- documenter onboarding, offboarding et rotation des secrets lorsque l'implémentation les rend concrets.

## Preview éditoriale

La preview native de Decap peut être utilisée lorsqu'elle apporte une aide utile, mais elle ne doit pas chercher à reproduire pixel-perfect le rendu Astro.

Ne pas dupliquer fortement le design ou la logique de rendu et ne pas ajouter une infrastructure disproportionnée uniquement pour cette fonction.

Une preview du vrai site après commit/build peut être envisagée indépendamment si une solution légère apporte une valeur suffisante.

## Rich text et Markdown

Decap étant en transition sur son expérience rich text, l'implémentation doit tester les round-trips Markdown avant validation du widget retenu.

Le Markdown généré doit rester :
- standard ;
- lisible ;
- stable après édition/enregistrement ;
- compatible Astro ;
- sans format propriétaire.

Le widget Decap exact reste à fixer après ces tests.

## Workflow Git et publication

Conserver initialement un workflow léger.

Le travail direct sur `main` reste autorisé lorsque pertinent. Les branches et Pull Requests sont facultatives et recommandées pour les changements plus importants ou risqués.

Le POC n'active pas par défaut un `editorial_workflow` Decap complexe.

L'état `publie: true/false` appartient au modèle de contenu et contrôle l'exposition publique. Il ne constitue pas un système de révisions.

La procédure précise pour modifier sur plusieurs sessions un contenu déjà publié tout en conservant l'ancienne version publique reste à définir pendant l'implémentation et l'exploitation.

## CI/CD

GitHub Actions constitue la chaîne officielle de validation, build et déploiement.

La chaîne doit :
1. exécuter les contrôles automatisés et tests de non-régression pertinents, y compris les validations de contenu ;
2. construire le site Astro ;
3. déployer les builds valides sur GitHub Pages selon le workflow retenu.

Les commandes de validation utilisées en CI doivent aussi être exécutables localement par un humain ou une IA.

## Implémentation du design

Le POC doit déjà avoir une personnalité visuelle assez affirmée tout en restant facile à modifier après le futur travail approfondi sur l'identité de marque PPC.

En conséquence :
- découpler identité visuelle et structure de l'information ;
- centraliser les variables de design : couleurs, typographies, espacements, rayons, etc. ;
- utiliser des composants réutilisables ;
- éviter les styles arbitraires dispersés page par page.

L'identité visuelle du POC est une proposition, pas un système de marque immuable.

## Environnements

Pas d'environnement de staging dédié initialement.

Le développement et la vérification technique se font localement.

Une preview distante pourra être envisagée plus tard si une solution légère apporte une valeur réelle.

## Analytics

Aucun analytics n'est implémenté dans le POC.

Ne pas introduire indirectement de scripts de tracking via des dépendances sans rapport avec ce besoin.

Une solution future légère et respectueuse de la vie privée pourra être étudiée si l'équipe décide que la mesure est utile.

## Cookies et vie privée

L'architecture doit éviter les trackers et services nécessitant un consentement tant qu'un besoin futur ne les justifie pas.

L'objectif initial est d'éviter une bannière cookies puisque le site n'a pas besoin de cookies de tracking.

Réévaluer les aspects juridiques à chaque introduction d'une intégration tierce.

## Navigateurs et terminaux

Supporter les usages responsive mobile, tablette et desktop.

Le site doit rester utilisable sur des terminaux raisonnablement anciens et des connexions modestes, sans chercher à maintenir indéfiniment des navigateurs réellement obsolètes.

Privilégier les standards Web éprouvés, l'amélioration progressive et la dégradation élégante.

Ne pas dépendre inutilement des toutes dernières fonctionnalités des navigateurs.

## Décisions techniques restant ouvertes

Restent à trancher pendant la conception technique / l'implémentation :
- chemins physiques exacts des collections, singletons et médias ;
- extensions et formats exacts collection par collection ;
- schémas Astro définitifs ;
- configuration YAML Decap et widgets exacts ;
- technologie et hébergement du composant OAuth ;
- règles précises de droits GitHub pour les contributeurs ;
- conventions de commits ;
- procédure des modifications longues d'un contenu déjà publié ;
- scripts de synchronisation éventuels ;
- limites éventuelles de taille des médias ;
- détails fins de preview ;
- éventuels analytics futurs ;
- éventuels budgets de performance après mesure.
