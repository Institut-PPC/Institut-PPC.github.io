# Qualité, accessibilité et SEO

## Philosophie qualité

La qualité du POC repose sur des protections proportionnées aux risques concrets du site, pas sur une couverture artificielle ou une suite de tests exhaustive.

Les objectifs sont :
- empêcher les contenus incohérents d'être publiés ;
- garantir qu'un build complet reste possible ;
- protéger les routes, liens, métadonnées et comportements publics essentiels ;
- conserver une base accessible, performante et sobre ;
- rendre les erreurs compréhensibles par un humain ou une IA reprenant le projet.

## Chaîne de validation

La validation est organisée en quatre niveaux complémentaires.

### 1. Tests des schémas

Tester les cas où une logique locale mérite réellement d'être protégée, notamment :
- variantes de `Ressource.mode_exposition` ;
- complétude de `Personne` selon ses rôles ;
- cohérence de `Référentiel.version_courante` ;
- formats de slugs, URLs, dates et enums lorsque non triviaux.

Ne pas écrire un test pour chaque champ simple uniquement pour augmenter un pourcentage de couverture.

### 2. Tests du validateur transverse

Utiliser de petites fixtures dédiées pour protéger notamment :
- relation valide / relation cassée ;
- sélection publique vers un contenu publié / non publié ;
- document local présent / absent ;
- collision de slugs ;
- redirection valide / incohérente.

Les tests ne doivent pas dépendre exclusivement du contenu éditorial réel du site.

### 3. Build Astro complet

`astro build` constitue un test d'intégration obligatoire. Il doit vérifier compilation, typage, rendu Markdown, imports d'images et génération complète des routes.

### 4. Contrôles sur le site généré

Après build, contrôler au minimum :
- liens internes cassés ;
- routes publiques attendues ;
- absence de route pour les contenus `publie: false` ;
- sitemap ;
- métadonnées essentielles ;
- quelques contrôles d'accessibilité automatisables sur des pages représentatives.

L'outil précis reste un choix d'implémentation.

## Stratégie de tests

### Composants

Tester les composants qui portent une vraie logique ou un risque : images accessibles, liens externes/internes, métadonnées, comportement lié aux modes d'exposition, etc.

Pour un widget tiers, protéger en particulier le titre accessible du cadre, le lien direct de repli, le filtrage de l'origine et de la source des messages, la validation de la hauteur et la coexistence de plusieurs instances.

Éviter les tests qui reproduisent simplement l'implémentation (`<div>`, texte statique, structure triviale).

### E2E

Aucune suite E2E lourde couvrant tout le site n'est introduite par défaut. Le site est statique et ne comporte ni compte public, ni panier, ni transaction métier nécessitant une orchestration navigateur exhaustive.

Un navigateur automatisé peut être ajouté ponctuellement lorsqu'un comportement concret le justifie.

### Decap

Ne pas automatiser toute l'interface Decap en CI. Les deux smoke tests de conception/acceptation sont :
1. round-trip `richtext` ↔ Markdown ;
2. médias Decap ↔ chemin local ↔ pipeline image Astro.

Une fois validés, documenter les invariants et protéger surtout le contrat de données résultant, pas les clics de l'interface CMS.

### Couverture

Aucun seuil minimal de couverture de code n'est imposé. Les règles capables de casser l'intégrité des contenus, les routes, l'accessibilité essentielle ou le déploiement doivent disposer d'une protection appropriée.

## Commandes locales

L'implémentation doit fournir des commandes simples permettant de reproduire localement les contrôles de la CI, conceptuellement :

```text
npm run dev
npm run validate
npm run test
npm run build
npm run check
```

Les noms exacts peuvent varier avec le gestionnaire de paquets retenu, mais une commande agrégée de contrôle local doit fournir une réponse proche de la CI.

## Markdown

Le sous-ensemble Markdown canonique est défini dans [`../contenu/contenu-et-cms.md`](../contenu/contenu-et-cms.md).

La validation et le smoke test Decap doivent protéger :
- hiérarchie H2-H4 ;
- paragraphes, listes, liens, emphase et citations ;
- images et textes alternatifs ;
- caractères français et typographie usuelle ;
- absence de syntaxe propriétaire ou HTML inattendu.

Les normalisations syntaxiques équivalentes (`*` vs `_`, type de puce, lignes vides) ne constituent pas à elles seules une régression si la sémantique et la lisibilité du diff sont préservées.

## Accessibilité

L'accessibilité doit être traitée dans le HTML, les composants et le design, et pas uniquement par un outil de test. Les règles visuelles et interactives complémentaires sont normées dans [`design-system.md`](design-system.md).

Principes :
- HTML sémantique ;
- `lang="fr"` ;
- un H1 déterminé par le template ;
- hiérarchie cohérente des titres ;
- landmarks natifs ;
- navigation clavier ;
- focus nettement visible avec `:focus-visible` lorsque pertinent ;
- liens et boutons sémantiquement corrects ;
- labels explicites ;
- liens éditoriaux reconnaissables autrement que par la couleur seule ;
- information et états non portés uniquement par la couleur ;
- contrastes conformes au minimum aux critères WCAG AA applicables pour les combinaisons réellement utilisées ;
- cibles interactives confortables, en visant environ 44 × 44 CSS px lorsque la nature du contrôle le permet ;
- aucune information essentielle révélée uniquement au `hover` ;
- respect de `prefers-reduced-motion` ;
- comportement robuste au zoom et à l'agrandissement du texte ;
- composants utilisables sans dépendance client inutile ;
- navigation responsive utilisable au clavier et au tactile, sans dépendre uniquement du `hover`, avec un bouton de menu qui expose son nom et son état lorsque pertinent.

Les contrôles automatisés d'accessibilité doivent être bloquants pour les violations sérieuses, déterministes et actionnables. Les heuristiques ambiguës nécessitent une revue humaine plutôt qu'un faux sentiment de conformité.

### Images et textes alternatifs

Pour `Actualité`, `Événement` et `Ressource`, `image_alt` est facultatif et décrit l'information éditoriale disponible. Le composant Astro décide de l'usage accessible dans son contexte : utiliser cette alternative lorsque l'image apporte une information autonome, ou `alt=""` lorsque la même image est décorative à cet emplacement.

Pour `Personne.photo` et `Organisation.logo`, ne pas dupliquer le nom dans un champ alt. Le composant dérive le nom accessible depuis l'entité lorsque nécessaire.

Les images Markdown utilisent leur alternative Markdown.

## SEO

Les fondamentaux SEO sont structurels et intégrés aux layouts :
- `<title>` ;
- métadescription lorsque pertinente ;
- URL canonique ;
- métadonnées Open Graph minimales lorsque pertinentes ;
- sitemap ;
- `robots.txt` ;
- structure de titres cohérente.

Le domaine public canonique `https://www.perennite-programmee-circulaire.org` doit être configuré dans Astro via `site` afin de générer correctement les URL absolues, sitemap et canonical. Le site est servi à la racine de ce domaine, sans préfixe de chemin.

Les contenus `publie: false` ne génèrent aucune route et ne doivent donc pas être gérés via `noindex`.

### Métadonnées dérivées dans le POC

Aucun override SEO générique n'est ajouté :
- titre de contenu → titre SEO ;
- résumé / chapô → métadescription ;
- image principale → image sociale lorsque pertinente ;
- route du site → canonical.

Un besoin réel pourra justifier plus tard un champ spécifique ; ne pas anticiper avec `titre_seo`, `og_title`, etc.

## URL et redirections

Les slugs sont considérés stables après première publication. Un changement exceptionnel nécessite une redirection explicite de l'ancienne route vers la nouvelle.

La CI doit pouvoir détecter les redirections incohérentes ou dont la cible n'existe pas. Sur GitHub Pages, une redirection statique générée par Astro n'est pas présentée comme une garantie de réponse HTTP serveur 301.

## Performance et sobriété

La performance est une exigence architecturale forte, mais aucun budget chiffré arbitraire n'est imposé avant mesure de pages représentatives.

Principes :
- HTML statique par défaut ;
- pas de framework client par défaut ;
- JavaScript client ciblé sur les besoins fonctionnels ou UX réels et proportionnés, y compris une interaction locale de navigation lorsque celle-ci améliore sensiblement l'expérience ;
- pas de SPA ni d'hydratation globale ;
- dépendances limitées et justifiées ;
- images optimisées par Astro ;
- dimensions d'images connues lorsque possible pour limiter les décalages de mise en page ;
- lazy-loading hors contenus prioritaires lorsque pertinent ;
- aucun tracker tiers par défaut ;
- polices système pour le POC, conformément à [`design-system.md`](design-system.md) ;
- si la future identité de marque rend une police spécifique nécessaire, privilégier l'auto-hébergement sous réserve de sa licence ;
- Tailwind CSS limité à son rôle de couche utilitaire de composition, avec un CSS produit limité au nécessaire ;
- design tokens PPC centralisés comme source de vérité de la charte et CSS Astro scopé lorsque pertinent ;
- animations décoratives évitées et transitions limitées aux retours d'interaction utiles.

Une fois des pages représentatives disponibles :
1. mesurer ;
2. identifier les vrais goulets d'étranglement ;
3. décider seulement alors si des budgets explicites de poids, JavaScript ou performance améliorent réellement la maintenabilité.

## Médias

Les images éditoriales locales sont des sources sous `contenu/medias/images/` et doivent utiliser le pipeline Astro lorsque pertinent. Les documents téléchargés sous `public/documents/` sont servis tels quels.

Objectifs pour les images :
- dimensions adaptées ;
- variantes responsives lorsque utiles ;
- formats modernes lorsque cela apporte un bénéfice ;
- chargement différé hors contenu prioritaire ;
- absence de médias décoratifs inutilement lourds.

Aucune limite de poids globale arbitraire n'est imposée. Un warning non bloquant peut être ajouté plus tard pour détecter des sources manifestement disproportionnées.

## Page 404

Prévoir une page 404 personnalisée, accessible, utile et légère, compatible avec GitHub Pages. Elle reste dans le code pour le POC.

## Pages légales et vie privée

Le POC doit prévoir :
- mentions légales ;
- politique de confidentialité ;
- page Accessibilité cohérente avec le niveau réel de conformité et les démarches effectivement menées.

Sans analytics ni formulaire de contact natif, le comportement lié à la vie privée doit rester volontairement simple.
