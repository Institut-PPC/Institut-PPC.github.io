# Contenu et CMS

## Philosophie éditoriale

Le CMS sert à **gérer des contenus structurés, pas à construire les pages**.

Les contributeurs non techniques doivent pouvoir créer et modifier les contenus importants qui évoluent. La structure du site, la navigation, la mise en page, les composants, les comportements et l'implémentation du design restent gérés dans le code par les contributeurs techniques, éventuellement assistés par IA.

## Niveau d'autonomie CMS

Tout contenu important et susceptible d'évoluer doit en principe être modifiable via le CMS.

Exemples :
- actualités ;
- événements ;
- personnes ;
- partenaires/organisations ;
- documents/référentiels ;
- textes et images importants lorsque pertinent.

Éviter de transformer le CMS en constructeur de pages WYSIWYG sans contraintes.

## Workflow éditorial

L'équipe devrait rester petite.

La publication directe est acceptable. Une fonction de brouillon est souhaitable mais non critique. Ne pas introduire de workflow d'approbation complexe sans besoin démontré.

## Statut du choix CMS

**Le choix final du CMS reste à faire.**

DecapCMS est le candidat de référence car le porteur du projet l'utilise déjà avec succès sur un autre site associatif Astro/GitHub Pages.

Des alternatives pourront être évaluées avant implémentation, notamment selon :
- ergonomie éditoriale pour des contributeurs non techniques ;
- modélisation de contenus structurés ;
- stockage Git / formats ouverts ;
- complexité d'authentification ;
- possibilités de prévisualisation ;
- compatibilité Astro ;
- charge de maintenance ;
- dépendance fournisseur ;
- réversibilité à long terme.

## Propriété et portabilité des contenus

Il s'agit d'une exigence forte.

Les contenus doivent rester disponibles dans des formats simples, ouverts et versionnés indépendamment du CMS : Markdown/MDX/YAML/JSON et formats média standards selon les besoins.

Git constitue l'historique durable de référence.

Le CMS est une **interface d'édition**, pas le propriétaire ni la base de données faisant autorité.

Changer ou supprimer le CMS ne doit pas imposer une migration complexe des contenus.

## Édition sans crainte

Le versionnement et la réversibilité doivent permettre aux contributeurs d'éditer sereinement.

Le système doit permettre de tracer et d'annuler les changements afin que les contributeurs n'aient pas peur de détériorer définitivement un contenu.

## Types de contenus provisoires

Les domaines de contenus structurés actuellement envisagés sont :
- actualités/articles ;
- événements ;
- personnes ;
- organisations/partenaires ;
- documents/référentiels ;
- contenus globaux du site lorsque pertinent.

Les schémas détaillés ne sont **pas encore spécifiés** et seront conçus lors d'une phase ultérieure de modélisation des contenus.

## Personnes et annuaire

Concevoir les données personnes/organisations en gardant à l'esprit un éventuel futur annuaire public.

Pour le POC, seule une présentation simple de l'association est requise, notamment :
- co-présidence ;
- Conseil d'administration ;
- fondateurs.

Éviter de coder en dur de longues listes lorsqu'un contenu structuré géré par CMS peut raisonnablement les représenter.

## Médias

Les contributeurs doivent pouvoir gérer les images depuis le CMS.

Le build doit assurer autant que possible une optimisation automatique raisonnable :
- dimensions adaptées ;
- variantes responsives ;
- formats modernes lorsqu'ils sont utiles ;
- chargement différé lorsque pertinent.

Ne pas sur-concevoir la chaîne média pendant le POC. Optimiser davantage une fois des pages représentatives mesurables.

Éviter les médias décoratifs lourds et les vidéos auto-hébergées sans valeur réelle.

## Multilingue

La V1/POC est **uniquement en français**.

Une future version anglaise ne doit être anticipée que lorsque cela est presque gratuit et n'ajoute pas de complexité significative au code ou au modèle de contenu. Ne pas construire à l'avance un système multilingue complet.

## Contenus existants

Le site Odoo actuel peut être consulté comme source.

Ne pas reproduire automatiquement sa structure ni migrer tous ses contenus. Lors de la conception des sections/pages, décider explicitement ce qui mérite d'être réutilisé.
