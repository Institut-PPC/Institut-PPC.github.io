# Architecture technique

## Statut

Spécification initiale de l'architecture du POC du site PPC.

## Socle technique

Le socle retenu est :

- **Astro** pour le site statique ;
- **GitHub** pour l'hébergement du dépôt et le versionnement ;
- **GitHub Pages** pour l'hébergement public ;
- **GitHub Actions** pour validation, build, tests de non-régression et déploiement.

Ce socle reprend volontairement une architecture déjà utilisée avec succès par le porteur du projet sur un autre site associatif.

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

Aucun budget de performance chiffré n'est fixé pendant le cadrage initial. Mesurer plus tard des pages représentatives avant de décider si des budgets explicites sont utiles.

## Dépendances tierces à l'exécution

Le site public essentiel doit rester aussi autonome que possible.

**Le fonctionnement essentiel du site public ne doit pas dépendre de services tiers à l'exécution.**

Des dépendances externes restent acceptables au cas par cas lorsqu'elles :
- répondent à un besoin réel ;
- sont légères et compréhensibles ;
- apportent une valeur supérieure à leur coût en complexité et dépendance ;
- sont raisonnablement remplaçables ;
- n'empêchent pas l'accès aux contenus essentiels en cas de panne.

Un petit proxy d'authentification nécessaire à un CMS Git-based est un exemple de dépendance potentiellement acceptable après évaluation explicite.

## Sécurité

Privilégier une **sécurité par simplicité architecturale**, pas des mécanismes de sécurité maison.

Principes :
- minimiser les services exposés et la logique runtime ;
- minimiser les secrets ;
- ne jamais exposer d'identifiants ou secrets côté client ;
- limiter les droits des contributeurs au strict nécessaire ;
- s'appuyer sur les mécanismes éprouvés de GitHub et des services retenus ;
- ne pas implémenter d'authentification/sécurité spécifique sans raison forte.

L'authentification du CMS est un critère important de sélection du CMS.

## Données et réversibilité

Le code, la configuration, les contenus structurés, les ressources pertinentes, les spécifications, les tests et la documentation d'exploitation doivent résider dans le dépôt lorsque cela est pertinent.

Les contenus doivent rester dans des formats portables indépendants du CMS.

Le dépôt est la source de vérité du fonctionnement du site.

Les documents de travail externes peuvent être liés plutôt que copiés dans le dépôt lorsque leur système d'origine est plus approprié.

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

Une preview distante pourra être envisagée plus tard, notamment si une solution légère liée au CMS apporte une valeur éditoriale réelle.

## Workflow Git

Conserver initialement un workflow léger.

Le travail direct sur `main` est autorisé lorsque pertinent. Les branches et Pull Requests sont facultatives et recommandées pour les changements plus importants ou risqués.

Ne pas protéger `main` initialement sauf si l'évolution de la collaboration justifie plus tard ce processus.

## CI/CD

GitHub Actions constitue la chaîne officielle de validation, build et déploiement.

La chaîne doit :
1. exécuter les contrôles automatisés et tests de non-régression pertinents ;
2. construire le site Astro ;
3. déployer les builds valides sur GitHub Pages selon le workflow retenu.

Les commandes de validation utilisées en CI doivent aussi être exécutables localement par un humain ou une IA.

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

## Décisions techniques futures

Restent à trancher :
- CMS final ;
- implémentation de l'authentification du CMS ;
- solution légère de prévisualisation éditoriale ;
- schémas détaillés des contenus ;
- éventuels analytics futurs ;
- éventuels budgets de performance après mesure.
