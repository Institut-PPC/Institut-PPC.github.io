# Vision et périmètre

## Statut

Spécification de la vision et du périmètre actuel du site PPC en production. Ce document décrit les décisions actuelles et signale explicitement les points restant à trancher.

## Identité du produit

Le site est avant tout le site de la **Pérennité Programmée Circulaire (PPC)**, et non simplement le site de l'association.

L'**Association pour la Pérennité Programmée Circulaire** est l'organisation d'intérêt général qui porte, protège, structure et développe la PPC et sa marque collective. L'association doit disposer d'une section dédiée, mais elle constitue une partie du site PPC au sens large.

## Vision du site

Le site PPC en production permet de comprendre la démarche, d’accéder à ses ressources et référentiels, de suivre ses activités et d’entrer en relation avec l’Association.

Son fonctionnement repose sur une architecture statique durable et sur des contenus structurés, versionnés et éditables par des contributeurs non techniques. Les choix décrits dans les spécifications sont validés et s’appliquent au site actuel.

L’identité visuelle « Ingénierie sensible » est utilisée en production tout en restant **transitoire et réversible**. Une éventuelle identité de marque PPC définitive doit pouvoir la remplacer sans restructuration du site.

## Publics prioritaires

Ordre de priorité actuel :

1. Personnes ou organisations souhaitant comprendre simplement ce qu'est la PPC.
2. Entreprises et acteurs industriels susceptibles d'adopter la PPC.
3. Personnes souhaitant rejoindre ou contribuer à l'association.
4. Organisations souhaitant utiliser ou obtenir la marque collective.
5. Autres acteurs contribuant au développement de la PPC : mécènes, institutions publiques, chercheurs et parties prenantes associées.

Un parcours conceptuel utile à long terme reste :

**Comprendre → Adopter → Rejoindre → Utiliser la marque collective → Contribuer**

Il ne constitue pas la navigation actuelle. En particulier, « Adopter la PPC » n'est pas encore un parcours pleinement actionnable et ne dispose pas d'une rubrique autonome. L'architecture de l'information courante et les parcours du site sont définis dans [`architecture-information.md`](architecture-information.md).

## Appels à l'action

Le site distingue les CTA d'orientation propres à chaque page des actions pratiques de prise de contact ou de soutien.

Dans la navigation globale :
- **Nous contacter** est le CTA distinct de l’en-tête ;
- **Adhérer / faire un don** reste facilement accessible depuis l'univers Association et le pied de page, sans devenir un CTA dominant de l’en-tête.

Sur la page d'accueil, les CTA structurants sont **Comprendre la PPC** puis **Travailler avec nous**.

Ces appels à l'action évolueront avec la maturité de PPC. De futurs appels pourront concerner la mise en œuvre de PPC, l'utilisation de la marque collective ou la consultation de référentiels matures. L'architecture ne doit pas inventer ni figer des processus qui ne sont pas encore définis. Voir [`architecture-information.md`](architecture-information.md) pour la répartition normative des CTA et parcours.

## Page d'accueil

Les textes et visuels de l’accueil proviennent du singleton canonique `contenu/pages/accueil.yaml`. Ils décrivent la démarche et les travaux actuels ; leur évolution éditoriale suit la charte du site définie dans [`../contenu/charte-editoriale.md`](../contenu/charte-editoriale.md).

La page d'accueil doit apporter quelques preuves sobres que la PPC est réelle et active, par un mélange léger de :
- les contenus et ressources publiés ;
- les travaux présentés dans les sections éditoriales ;
- les dernières actualités et les prochains événements publiés, sélectionnés automatiquement.

Des chiffres, indicateurs ou acteurs impliqués peuvent compléter ces preuves lorsque des données validées sont disponibles.

Éviter l'effet tableau de bord d'entreprise ou mur de logos.

## Marque collective

La marque collective constitue une **section spécialisée du site** expliquant :
- son rôle ;
- son articulation avec le Référentiel PPC autonome ;
- ce qui est aujourd'hui disponible ou encore en construction.

Elle n'est pas encore un grand parcours transactionnel.

L'architecture doit néanmoins permettre à cette zone de devenir plus tard un pilier majeur couvrant par exemple :

**référentiels → critères → processus → candidature → contrôle → organisations utilisant la marque**

Ne pas implémenter ce processus futur avant que ses règles métier n'existent.

Le Référentiel PPC publié est une rubrique autonome de premier niveau sous
`/referentiel` et `/referentiel/ppc`. Ce choix de navigation ne modifie pas son
lien fonctionnel avec la marque collective.

## Section Association

Le site comporte une présentation structurée de l'association, comprenant au minimum :
- la co-présidence ;
- le Conseil d'administration ;
- les membres fondateurs.

Les personnes exposées publiquement sont représentées par des entités structurées `Personne` et les pages institutionnelles dérivent leur affichage de rôles PPC contrôlés. La co-présidence, le Conseil d'administration et les membres fondateurs présentés sur le site disposent d'un visuel et d'un lien LinkedIn. Le visuel `placeholder-personne.webp` est utilisé normalement lorsqu’aucune photo n’est disponible.

Les membres fondateurs disposent d'une page dédiée `/association/membres-fondateurs`, afin de permettre une présentation visuelle claire sans transformer la page Association ou la page Gouvernance en annuaire exhaustif.

Un annuaire public complet n'est **pas requis dans le périmètre actuel**, mais l'architecture des contenus ne doit pas l'empêcher ultérieurement.

## Sources canoniques

Les contenus publiés et leur structure sont définis dans ce dépôt. L’ancien site Odoo peut servir de source documentaire lorsqu’un contenu est repris ; il ne définit ni l’architecture ni le périmètre courant du site PPC. Aucun plan exhaustif de migration/redirection de ses anciennes URL n’est requis.

## Réseaux sociaux

Le principe est **le site d'abord, les réseaux sociaux ensuite**.

Le site peut contenir des liens vers les comptes sociaux de PPC et éventuellement proposer des actions de partage légères, mais il ne doit pas embarquer par défaut de flux ou widgets sociaux tiers.

Les actualités importantes de PPC doivent exister comme contenus durables du site, puis éventuellement être relayées sur les plateformes sociales.

## Travaux futurs

L'architecture de l'information détaillée, le sitemap, la navigation, le rôle des pages et les parcours principaux sont désormais spécifiés dans [`architecture-information.md`](architecture-information.md).

Les modèles de contenu structurés et le choix du CMS sont spécifiés dans [`../contenu/contenu-et-cms.md`](../contenu/contenu-et-cms.md). La conception technique détaillée est désormais spécifiée dans [`../technique/architecture.md`](../technique/architecture.md), le design system et l'identité visuelle transitoire actuelle dans [`../technique/design-system.md`](../technique/design-system.md), les exigences qualité dans [`../technique/qualite-accessibilite-seo.md`](../technique/qualite-accessibilite-seo.md), et l'exploitation dans [`../exploitation/exploitation.md`](../exploitation/exploitation.md).

Le socle Astro, Decap, les validations, le pipeline de publication et le design system sont implémentés. Les contenus publiés évoluent dans le cadre de la maintenance éditoriale du site.

Les évolutions de périmètre encore futures sont :
- parcours détaillé de la marque collective lorsque les règles métier seront matures ;
- éventuel parcours « Adopter la PPC » lorsque son offre et ses règles seront suffisamment définies.
