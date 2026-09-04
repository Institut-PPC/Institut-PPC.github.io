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
- tests de non-régression des comportements fonctionnels importants ;
- contrôles d'accessibilité apportant un signal utile.

N'ajouter des tests navigateur/end-to-end plus lourds que lorsque des parcours importants justifient leur coût de maintenance.

Les tests et validations doivent être exécutables localement et via GitHub Actions.

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

Ne pas introduire de plateforme média complexe pendant le POC sans besoin démontré.

## Page 404

Prévoir une page 404 personnalisée, accessible, utile et légère, compatible avec GitHub Pages.

## Pages légales et vie privée

Le POC doit prévoir la structure pour :
- les mentions légales ;
- la politique de confidentialité.

Les textes juridiques définitifs pourront être complétés avant la production.

Sans analytics ni formulaire de contact natif, le comportement lié à la vie privée doit rester volontairement simple.
