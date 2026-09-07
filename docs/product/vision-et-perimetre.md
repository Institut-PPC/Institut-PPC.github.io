# Vision et périmètre

## Statut

Spécification produit du POC du site PPC. Ce document décrit les décisions actuelles et signale explicitement les points restant à trancher.

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

Un parcours conceptuel utile à long terme reste :

**Comprendre → Adopter → Rejoindre → Utiliser la marque collective → Contribuer**

Il ne constitue pas la navigation du POC. En particulier, « Adopter la PPC » n'est pas encore un parcours pleinement actionnable et ne dispose pas d'une rubrique autonome dans le POC. L'architecture de l'information courante et les parcours effectivement testés sont définis dans [`architecture-information.md`](architecture-information.md).

## Appels à l'action initiaux

Le POC doit distinguer les CTA d'orientation propres à chaque page des actions pratiques de prise de contact ou de soutien.

Dans la navigation globale :
- **Nous contacter** est le CTA distinct de l’en-tête ;
- **Adhérer / faire un don** reste facilement accessible depuis l'univers Association et le pied de page, sans devenir un CTA dominant de l’en-tête.

Sur la page d'accueil du POC, les CTA structurants sont **Comprendre la PPC** puis **Travailler avec nous**.

Ces appels à l'action évolueront avec la maturité de PPC. De futurs appels pourront concerner la mise en œuvre de PPC, l'utilisation de la marque collective ou la consultation de référentiels matures. L'architecture ne doit pas inventer ni figer des processus qui ne sont pas encore définis. Voir [`architecture-information.md`](architecture-information.md) pour la répartition normative des CTA et parcours.

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
- ce qui est aujourd'hui disponible ou encore en construction.

Elle n'est pas encore un grand parcours transactionnel.

L'architecture doit néanmoins permettre à cette zone de devenir plus tard un pilier majeur couvrant par exemple :

**référentiels → critères → processus → candidature → contrôle → organisations utilisant la marque**

Ne pas implémenter ce processus futur avant que ses règles métier n'existent.

## Section Association

Le POC doit comporter une présentation structurée de l'association, comprenant au minimum :
- la co-présidence ;
- le Conseil d'administration ;
- les membres fondateurs.

Les personnes exposées publiquement sont représentées par des entités structurées `Personne` et les pages institutionnelles dérivent leur affichage de rôles PPC contrôlés. La co-présidence, le Conseil d'administration et les membres fondateurs présentés sur le site disposent d'une photo et d'un lien LinkedIn.

Les membres fondateurs disposent d'une page dédiée `/association/membres-fondateurs`, afin de permettre une présentation visuelle claire sans transformer la page Association ou la page Gouvernance en annuaire exhaustif.

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

L'architecture de l'information détaillée, le sitemap, la navigation, le rôle des pages et les parcours principaux sont désormais spécifiés dans [`architecture-information.md`](architecture-information.md).

Les modèles de contenu structurés et le choix du CMS sont spécifiés dans [`../contenu/contenu-et-cms.md`](../contenu/contenu-et-cms.md). La conception technique détaillée est désormais spécifiée dans [`../technique/architecture.md`](../technique/architecture.md), [`../technique/qualite-accessibilite-seo.md`](../technique/qualite-accessibilite-seo.md) et [`../exploitation/exploitation.md`](../exploitation/exploitation.md).

Restent notamment à concevoir, finaliser ou implémenter dans les phases suivantes :
- implémentation du socle Astro, de Decap, des validations et du pipeline décrits par les spécifications techniques ;
- design system / identité visuelle initiale ;
- contenu éditorial final ;
- parcours détaillé de la marque collective lorsque les règles métier seront matures ;
- éventuel parcours « Adopter la PPC » lorsque son offre et ses règles seront suffisamment définies.
