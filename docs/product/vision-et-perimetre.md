# Vision et périmètre

## Statut

Spécification produit initiale du POC du site PPC. Ce document décrit les décisions actuelles et signale explicitement les points restant à trancher.

## Identité du produit

Le site est avant tout le site de la **Pérennité Programmée Circulaire (PPC)**, et non simplement le site de l'association.

L'**Association pour la Pérennité Programmée Circulaire** est l'organisation d'intérêt général qui porte, protège, structure et développe la PPC et sa marque collective. L'association doit disposer d'une section dédiée, mais elle constitue une partie du site PPC au sens large.

## Ambition du POC

Le POC doit être un **produit presque final**, et non une maquette jetable.

Après validation par la co-présidence, l'issue privilégiée est de compléter/intégrer le POC et de le mettre en production plutôt que de le reconstruire.

Le POC doit notamment permettre à la co-présidence d'évaluer :
- l'expérience du site et la direction visuelle ;
- si la gestion de contenus structurés est suffisamment souple et confortable pour des contributeurs non techniques ;
- si l'architecture constitue un remplacement crédible et durable du site Odoo actuel.

## Publics prioritaires

Ordre de priorité actuel :

1. Personnes ou organisations souhaitant comprendre simplement ce qu'est la PPC.
2. Entreprises et acteurs industriels susceptibles d'adopter la PPC.
3. Personnes souhaitant rejoindre ou contribuer à l'association.
4. Organisations souhaitant utiliser ou obtenir la marque collective.
5. Autres acteurs contribuant au développement de la PPC : mécènes, institutions publiques, chercheurs et parties prenantes associées.

Un parcours conceptuel utile est :

**Comprendre → Adopter → Rejoindre → Utiliser la marque collective → Contribuer**

Il ne s'agit pas d'une navigation figée. En particulier, « Adopter la PPC » n'est pas encore un parcours pleinement actionnable dans la V1.

## Appels à l'action initiaux

Le POC/V1 comporte initialement deux appels à l'action pratiques :

1. **Contactez-nous** — pour en savoir plus ou participer.
2. **Adhérez ou faites un don** — pour soutenir l'association.

Ces appels à l'action évolueront avec la maturité de la PPC. De futurs appels pourront concerner la mise en œuvre de la PPC, l'utilisation de la marque collective ou la consultation de référentiels matures. L'architecture ne doit pas figer les CTA actuels.

## Page d'accueil

Le texte de la page d'accueil Odoo actuelle constitue une **source de contenu provisoire**, et non une rédaction finale approuvée. L'équipe PPC doit le retravailler. Ne pas traiter cette formulation comme une spécification immuable.

La page d'accueil doit apporter quelques preuves sobres que la PPC est réelle et active, par un mélange léger de :
- quelques chiffres ou indicateurs concrets ;
- quelques acteurs impliqués ou logos lorsque cela est utile ;
- des contenus, travaux ou événements récents.

Éviter l'effet tableau de bord d'entreprise ou mur de logos.

## Marque collective

Pour le POC/V1, la marque collective constitue une **section spécialisée du site** expliquant :
- son rôle ;
- les référentiels disponibles ;
- le mécanisme envisagé.

Elle n'est pas encore un grand parcours transactionnel.

L'architecture doit néanmoins permettre à cette zone de devenir plus tard un pilier majeur couvrant par exemple :

**référentiels → critères → processus → candidature → contrôle → organisations utilisant la marque**

Ne pas implémenter ce processus futur avant que ses règles métier n'existent.

## Section Association

Le POC doit comporter une présentation simple de l'association, comprenant au minimum :
- la co-présidence ;
- le Conseil d'administration ;
- les fondateurs.

Les données doivent de préférence être structurées plutôt que codées en dur afin de pouvoir évoluer et éventuellement alimenter un futur annuaire public.

Un annuaire public complet n'est **pas requis dans le POC**, mais l'architecture des contenus ne doit pas l'empêcher ultérieurement.

## Site Odoo existant

Le site Odoo actuel est une **source documentaire et de contenus**, pas une architecture d'information à reproduire.

Il contient actuellement relativement peu de contenu. Lors de la conception de chaque section, décider explicitement quels contenus existants doivent être réutilisés, restructurés, supprimés ou remplacés.

Aucun plan exhaustif de migration/redirection des URL Odoo n'est requis, le site existant étant récent.

## Réseaux sociaux

Le principe est **le site d'abord, les réseaux sociaux ensuite**.

Le site peut contenir des liens vers les comptes sociaux de PPC et éventuellement proposer des actions de partage légères, mais il ne doit pas embarquer par défaut de flux ou widgets sociaux tiers.

Les actualités importantes de PPC doivent exister comme contenus durables du site, puis éventuellement être relayées sur les plateformes sociales.

## Travaux futurs

Restent à concevoir dans les phases suivantes :
- architecture de l'information détaillée et sitemap ;
- navigation ;
- rôle et contenu détaillé des pages ;
- modèles de contenu détaillés ;
- choix final du CMS ;
- design system / identité visuelle initiale ;
- parcours détaillé de la marque collective lorsque les règles métier seront matures.
