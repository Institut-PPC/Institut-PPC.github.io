# Qualité, accessibilité et SEO

## Philosophie qualité

Les tests automatisés servent à protéger la confiance et prévenir les régressions significatives, pas à maximiser artificiellement un pourcentage de couverture.

Un humain ou un agent IA doit pouvoir modifier le site et déterminer rapidement s'il a cassé quelque chose d'important.

## Validation automatisée

L'outillage exact sera choisi pendant l'implémentation, mais le périmètre visé comprend selon pertinence :
- build de production Astro ;
- contrôles TypeScript/statiques ;
- linting et validation du formatage ;
- validation des liens internes ;
- validation des contenus structurés et de leurs relations ;
- tests de non-régression des comportements fonctionnels importants ;
- contrôles d'accessibilité apportant un signal utile.

N'ajouter des tests navigateur/end-to-end plus lourds que lorsque des parcours importants justifient leur coût de maintenance.

Les tests et validations doivent être exécutables localement et via GitHub Actions.

## Validation des contenus structurés

Les schémas et/ou le build doivent empêcher les incohérences connues que le CMS ne garantit pas suffisamment.

Contrôles attendus au minimum :
- conformité de chaque contenu à son modèle ;
- identifiants stables présents et cohérents pour les entités concernées ;
- références entre contenus résolubles lorsque présentes ;
- pour une `Personne` portant `co-presidence`, `conseil-administration` ou `membre-fondateur` : présence d'une photo et d'un lien LinkedIn ;
- pour un `Référentiel` : `version_courante` correspond à un identifiant existant dans `versions[].id` ;
- pour une `Ressource` en mode lien direct : présence d'une destination directe valide ;
- pour une `Ressource` en mode page interne : présence du slug et des éléments de contenu requis par le modèle ;
- respect de l'état `publie` dans la génération des pages, listes et sélections publiques.

Ces contrôles sont des garanties techniques du modèle documenté, pas des règles métier PPC supplémentaires.

## Markdown

Les contenus éditoriaux du POC utilisent du Markdown standard et sobre, sans MDX éditorial ni page builder.

Les tests d'intégration du CMS doivent vérifier qu'un cycle lecture → modification → enregistrement ne transforme pas le Markdown de manière indésirable.

Le round-trip Decap doit être testé au minimum sur :
- titres ;
- paragraphes ;
- listes ;
- liens ;
- emphase ;
- citations ;
- images.

Le Markdown enregistré doit rester lisible directement dans le dépôt et exploitable hors du CMS.

## Accessibilité

Viser **WCAG 2.2 AA et les bonnes pratiques RGAA dès la conception**, sans faire de la certification formelle du POC un objectif.

L'accessibilité est une exigence architecturale, pas une finition.

Porter notamment attention à :
- HTML sémantique ;
- navigation clavier ;
- focus visibles ;
- contrastes suffisants ;
- textes alternatifs pertinents ;
- hiérarchie des titres ;
- contrôles interactifs accessibles ;
- formulaires accessibles si des formulaires sont ajoutés ;
- limitation des mouvements et des informations uniquement visuelles.

### Images et textes alternatifs

Lorsqu'une image porte une information, un texte alternatif pertinent est requis. Les images purement décoratives doivent être traitées conformément aux bonnes pratiques d'accessibilité et ne pas recevoir un texte alternatif artificiel.

Les modèles de contenu doivent permettre de fournir les textes alternatifs nécessaires sans forcer un champ inutile lorsque l'image est décorative ou absente.

Un audit ou une démarche de conformité formelle pourra être envisagé séparément lorsque pertinent.

## SEO

Mettre en place un socle SEO technique sain dans le POC sans construire une stratégie SEO avancée.

Le socle doit inclure selon pertinence :
- HTML sémantique ;
- titres et descriptions significatifs ;
- URL propres, stables et lisibles ;
- sitemap ;
- URL canoniques ;
- métadonnées Open Graph/sociales ;
- données structurées uniquement lorsqu'elles ont un sens réel ;
- bonnes performances ;
- contenus publics indexables.

### Métadonnées dérivées dans le POC

Aucun champ d'override SEO spécifique n'est prévu.

Par défaut :
- titre du contenu → titre SEO ;
- résumé / chapô → métadescription ;
- image principale → image sociale lorsque pertinente ;
- URL → route canonique définie par le site.

Ne pas ajouter `titre_seo`, `description_seo`, `og_title`, `og_description` ou équivalents sans besoin démontré.

Aucun analytics n'étant disponible initialement, l'optimisation SEO pilotée par la donnée et la mesure continue sont hors périmètre du POC.

La qualité du SEO technique ne dépend pas des analytics et doit être correcte dès le départ.

## Performance et sobriété

La performance est une exigence architecturale forte, mais aucun budget numérique arbitraire n'est imposé avant de disposer de pages représentatives.

Une fois ces pages construites :
1. les mesurer ;
2. identifier les vrais goulets d'étranglement ;
3. décider si des budgets explicites de poids de page, JavaScript ou performance amélioreraient la qualité à long terme.

Optimiser pour une expérience réelle utile, y compris sur connexions modestes et terminaux plus anciens.

## Médias

Utiliser les capacités d'Astro et du build statique pour assurer une optimisation raisonnable des images et leur diffusion responsive.

Objectifs selon pertinence :
- dimensions adaptées ;
- variantes responsives ;
- formats modernes utiles ;
- chargement différé hors contenus prioritaires ;
- absence de médias décoratifs inutilement lourds.

La politique de stockage reste hybride : fichiers PPC légers et canoniques dans le dépôt lorsque pertinent ; médias lourds ou tiers via URL externe.

Ne pas introduire de plateforme média complexe pendant le POC sans besoin démontré.

## Page 404

Prévoir une page 404 personnalisée, accessible, utile et légère, compatible avec GitHub Pages.

## Pages légales et vie privée

Le POC doit prévoir la structure pour :
- les mentions légales ;
- la politique de confidentialité ;
- une page Accessibilité cohérente avec le niveau réel de conformité et les démarches effectivement menées.

Les textes juridiques définitifs et les informations formelles d'accessibilité pourront être complétés avant la production.

Sans analytics ni formulaire de contact natif, le comportement lié à la vie privée doit rester volontairement simple.
