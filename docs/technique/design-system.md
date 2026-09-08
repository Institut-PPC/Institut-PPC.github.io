# Identité visuelle et design system

## Statut

Spécification normative de l'identité visuelle **transitoire** et du design system du POC du site PPC.

Cette identité est volontairement simple et réversible : une initiative distincte de conception de l'identité de la **marque PPC** doit pouvoir la remplacer ultérieurement sans restructurer les pages ni les composants. Les valeurs définies ici sont normatives pour le POC tant qu'une nouvelle charte n'a pas été validée.

La présente spécification complète [`architecture.md`](architecture.md) et [`qualite-accessibilite-seo.md`](qualite-accessibilite-seo.md). Les règles produit et de hiérarchie de marque restent définies dans les documents sous `docs/product/`.

## Références visuelles transitoires

Deux éléments existants servent de point d'ancrage pour le POC :

- le logo actuel de l'**Association pour la Pérennité Programmée Circulaire**, dessiné par Christian Bruère : `https://www.perennite-programmee-circulaire.com/web/image/website/1/logo/AssoPPC` ;
- l'illustration **« Révéler la valeur invisible »**, déjà utilisée dans des présentations PPC : `https://www.perennite-programmee-circulaire.com/web/image/1890-9fc31beb/R%C3%A9v%C3%A9ler%20la%20valeur%20invisible.webp`.

Ces références guident l'identité transitoire ; elles ne constituent pas une charte de marque définitive.

Le logo de l'Association ne doit pas être chargé à l'exécution depuis le site Odoo actuel. Lors de l'implémentation, utiliser un asset local approuvé, idéalement le fichier source vectoriel lorsqu'il est disponible, sous `src/assets/identite/`. L'illustration « Révéler la valeur invisible » est une référence stylistique et n'a pas à être intégrée automatiquement au futur site.

Le site reste avant tout le site de **PPC**. L'Association est l'organisation qui porte et protège PPC ; son logo actuel ne doit pas conduire à faire de l'Association l'identité conceptuelle englobante de toutes les rubriques.

## Direction visuelle : « Ingénierie sensible »

La direction retenue pour le POC est **Ingénierie sensible**.

Principes directeurs :

1. **Précis, mais pas froid.** Grilles, alignements, hiérarchie et schémas doivent transmettre rigueur et maîtrise, sans produire une esthétique administrative ou de documentation technique austère.
2. **Industriel, mais inscrit dans le vivant.** La dimension écologique et le vivant sont présents sans recours systématique aux clichés graphiques écologiques génériques tels que feuilles, forêt ou vert dominant.
3. **Construit pour durer.** Privilégier une esthétique sobre, contemporaine mais intemporelle, et éviter les effets de mode décoratifs.
4. **Une base calme permet quelques signes forts.** La majorité de l'interface reste neutre et respirante ; le violet PPC et surtout l'accent cuivre sont utilisés avec parcimonie.
5. **Explicatif avant décoratif.** Les visuels, schémas et illustrations doivent prioritairement aider à comprendre PPC.

Positionnement indicatif :

| Axe | Position du POC |
| --- | --- |
| Institutionnel ↔ militant | plutôt institutionnel, sans froideur |
| Technique ↔ humain | technique avec une dimension humaine perceptible |
| Industriel ↔ vivant | les deux, volontairement en tension |
| Sérieux ↔ chaleureux | sérieux mais accueillant |
| Sobre ↔ expressif | sobre avec quelques accents forts |
| Contemporain ↔ intemporel | nettement intemporel |
| Décoratif ↔ explicatif | très nettement explicatif |

Formule de référence pour l'implémentation :

> Une identité d'ingénierie sobre et intemporelle, précise sans être froide, où une base neutre et structurée accueille quelques signes chaleureux évoquant le temps long, la valeur et le vivant.

## Stratégie CSS

### Choix retenu

Le POC utilise la doctrine suivante :

> design tokens centraux + Tailwind CSS pour la composition courante + CSS Astro scopé lorsque cela améliore réellement la lisibilité ou exprime une logique propre au composant.

Tailwind constitue la couche utilitaire de composition de l'interface. Il sert notamment au layout, à Flexbox et Grid, au responsive, aux espacements, aux dimensions, à la visibilité, au positionnement et aux états d'interaction. Il ne devient pas la source de vérité de l'identité visuelle.

Les couleurs, typographies, rayons, espacements de charte et autres décisions de marque restent centralisés dans les design tokens PPC. Les composants et utilitaires Tailwind consomment ces tokens ou leurs mappings plutôt que de répéter des valeurs de marque arbitraires dans les templates.

Le projet n'ajoute pas de framework d'utilitaires maison en parallèle. Tailwind et les composants Astro restent le socle du POC ; aucune bibliothèque de composants UI n'est obligatoire. Bootstrap, Material UI, DaisyUI ou un design system tiers ne doit pas être introduit uniquement pour accélérer la réalisation de composants simples. Une bibliothèque spécialisée pourra être réévaluée ultérieurement si un besoin réel apparaît.

### Compatibilité et amélioration progressive

Privilégier les fonctionnalités Web largement disponibles et éprouvées, notamment :

- custom properties CSS ;
- Flexbox ;
- CSS Grid ;
- media queries classiques ;
- `gap` ;
- `clamp()` ou `aspect-ratio` lorsqu'ils apportent un bénéfice réel et qu'un rendu dégradé reste correct.

Une fonctionnalité CSS plus récente ne doit pas conditionner l'accès au contenu, à la navigation ou à une fonction essentielle lorsqu'une solution plus simple et plus largement compatible suffit.

Le rendu peut être moins élaboré sur un navigateur ancien sans devenir inutilisable : le HTML sémantique, l'ordre du contenu, les liens et les fonctions essentielles doivent rester exploitables. Le projet suit un principe d'**amélioration progressive** plutôt que de parité visuelle absolue sur tout navigateur historique.

## Architecture des styles

Organisation cible :

```text
src/
├── assets/
│   └── identite/               # logo et assets d'interface liés à l'identité
├── styles/
│   ├── tokens.css              # fondations et tokens sémantiques centraux
│   └── global.css              # règles réellement globales
└── components/
    └── ...                     # composants Astro et styles scopés lorsque pertinents
```

Tailwind s'intègre à cette organisation comme couche de composition, sans déplacer la source de vérité de la charte hors de `tokens.css`.

### `tokens.css`

Contient uniquement les décisions de design susceptibles d'être partagées ou de changer globalement :

- familles et échelle typographiques ;
- couleurs ;
- échelle d'espacement ;
- largeurs de contenu ;
- rayons ;
- bordures et durées d'interaction lorsque pertinentes ;
- tokens sémantiques utilisés par les composants.

Aucune règle `.card`, `.hero`, `.footer` ou équivalente n'y est définie.

### `global.css`

Contient seulement les règles réellement globales :

- petit reset et `box-sizing` ;
- styles de base `html` et `body` ;
- fond et couleur de texte par défaut ;
- typographie de base ;
- comportement générique des images et SVG ;
- liens éditoriaux lorsque pertinent ;
- focus global ;
- prise en compte de `prefers-reduced-motion` ;
- primitives rares et justifiées comme `.visually-hidden` et éventuellement `.container`.

Ne pas y reconstruire un framework d'utilitaires (`.mt-4`, `.flex`, `.grid`, etc.) en parallèle de Tailwind.

### Tailwind CSS

Tailwind prend en charge la composition courante : layout, Flexbox, Grid, responsive, espacements, dimensions, visibilité, positionnement et états d'interaction. Sa configuration ou ses mappings exposent les design tokens PPC lorsque ceux-ci portent un choix de charte.

Ne pas multiplier les valeurs arbitraires de couleur, typographie, rayon ou espacement de charte dans les templates. Une valeur arbitraire reste acceptable lorsqu'elle exprime une contrainte structurelle réellement locale et non une décision de marque.

### Styles des composants

Les composants Astro peuvent utiliser leurs blocs `<style>` scopés pour une structure complexe, un comportement spécifique ou une logique propre au composant lorsque ce CSS dédié reste plus lisible qu'une accumulation d'utilitaires. Ils consomment les tokens centraux pour les choix de charte.

Règle normative :

> Les composants ne doivent pas définir localement les choix constitutifs de l'identité visuelle lorsqu'un token central peut raisonnablement les représenter. Les tokens restent volontairement limités aux valeurs globales ou sémantiques susceptibles d'évoluer avec la charte. Les choix de composition courante utilisent Tailwind ; les choix complexes ou propres à un composant peuvent rester définis dans son CSS scopé lorsque cela améliore la lisibilité.

Les composants consomment en priorité des tokens **sémantiques** (`--color-text`, `--color-surface`, `--radius-surface`, etc.) plutôt que des noms de teintes ou des valeurs brutes.

Une valeur arbitraire reste acceptable lorsqu'elle décrit réellement la structure locale d'un composant, par exemple `aspect-ratio: 3 / 2` ou `grid-template-columns: 2fr 1fr`. Les couleurs hexadécimales, familles typographiques, espacements de charte et rayons ne doivent pas être répétés localement sans justification.

## Tokens du POC

Les noms ci-dessous constituent le vocabulaire de départ. Il peut être étendu lorsqu'un besoin réel apparaît ; ne pas créer de token spéculatif.

### Couleurs

```css
:root {
  --color-background: #f6f4ee;
  --color-surface: #ffffff;
  --color-text: #1e2430;
  --color-text-muted: #596a74;
  --color-brand: #2d155e;
  --color-accent: #a55d32;
  --color-border: #d6d3ca;
  --color-border-strong: #596a74;
  --color-link: #2d155e;
  --color-link-hover: #4a2a80;
  --color-focus: #a55d32;
  --color-on-brand: #ffffff;
}
```

Principes d'usage :

- ivoire + anthracite forment la base ;
- le violet assure la continuité avec le logo actuel et porte les actions ou signes identitaires principaux ;
- le gris acier est adapté aux informations secondaires et au langage des schémas ;
- le cuivre est un accent rare, pas une deuxième couleur dominante ; il sert notamment de focus fonctionnel lorsqu'un accent fortement perceptible est utile ;
- `--color-border` convient aux séparations non essentielles ; les limites de contrôles qui doivent être clairement perceptibles utilisent `--color-border-strong` ou un contraste équivalent ;
- ne pas utiliser le cuivre par défaut pour du petit texte courant ;
- l'information ne doit jamais être portée uniquement par la couleur.

Les combinaisons utilisées dans l'interface doivent respecter au minimum les critères de contraste WCAG de niveau AA applicables. Les valeurs initiales offrent notamment une marge importante pour le texte anthracite ou violet sur ivoire ; le cuivre est réservé à des usages où son contraste et sa fonction ont été vérifiés. Les couleurs fonctionnelles supplémentaires (`success`, `warning`, `error`, etc.) ne sont pas créées tant qu'un besoin réel du site ne les justifie pas.

### Typographie

Aucun fichier de police n'est téléchargé pour le POC.

```css
:root {
  --font-body: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-display: Georgia, "Times New Roman", serif;

  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: clamp(1.75rem, 3vw, 2.5rem);
  --font-size-display: clamp(2.25rem, 5vw, 4rem);

  --line-height-body: 1.6;
  --line-height-heading: 1.2;
  --line-height-display: 1.1;
}
```

Usage :

- `--font-body` pour le corps, la navigation, les boutons, les métadonnées et l'interface ;
- `--font-display` avec parcimonie pour les grands titres éditoriaux qui participent à l'identité, notamment le H1 de l'accueil et certains grands titres de section ;
- ne pas appliquer automatiquement la serif à tous les titres ;
- la lisibilité prime sur l'effet graphique.

La future identité de marque pourra remplacer ces deux piles de polices à partir des tokens. Si elle retient une police spécifique, privilégier l'auto-hébergement lorsque la licence le permet.

### Espacements

Échelle de départ :

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;

  --space-content: var(--space-5);
  --space-section: clamp(3rem, 7vw, 6rem);
  --page-gutter: clamp(1rem, 3vw, 2rem);
}
```

Cette échelle est volontairement courte. Ajouter une valeur uniquement si un besoin de composition récurrent le justifie.

### Géométrie, bordures et interaction

```css
:root {
  --radius-control: 0.375rem;
  --radius-surface: 0.5rem;
  --border-width: 1px;
  --interaction-duration: 150ms;
}
```

Les bordures fines et l'espace sont privilégiés aux ombres. Ne pas créer de token d'ombre tant qu'un besoin réel de superposition ne le justifie.

### Largeurs de contenu

```css
:root {
  --width-reading: 44rem;
  --width-content: 72rem;
  --width-wide: 80rem;
}
```

- `--width-reading` : textes longs et contenus éditoriaux ; viser en pratique environ 60 à 75 caractères par ligne ;
- `--width-content` : conteneur standard du site ;
- `--width-wide` : schémas, hero ou compositions qui bénéficient réellement d'une largeur supérieure.

## Langage graphique

### Formes et surfaces

- formes structurées et géométrie simple ;
- arrondis légers uniquement ;
- bordures fines, surfaces claires et espaces blancs comme principaux moyens de séparation ;
- ombres uniquement lorsqu'elles expriment une superposition réelle, par exemple un menu ouvert ;
- éviter les gradients décoratifs, glassmorphism, grosses cartes très arrondies et autres effets de mode non justifiés.

### Éviter la « cardification »

Ne pas entourer chaque information d'une carte. Les sections éditoriales sont séparées en priorité par l'espace, la hiérarchie et éventuellement un trait. Une carte est utilisée lorsqu'elle représente un vrai regroupement fonctionnel ou éditorial.

### Illustrations et schémas

Les schémas sont un langage important pour PPC et doivent servir l'explication :

- traits fins et construction claire ;
- palette restreinte ;
- gris acier pour la structure ;
- accent cuivre ponctuel ;
- SVG privilégié lorsqu'il est adapté au contenu ;
- pas d'effet 3D ou d'illustration décorative sans utilité pédagogique.

Le contenu essentiel d'un schéma complexe doit également être accessible dans le texte, une légende ou une description structurée ; ne pas reporter une description longue et complexe dans `alt`.

### Photographie

Privilégier des images authentiques liées à PPC, ses personnes, ses événements et ses réalisations. Mieux vaut l'absence de photographie qu'une image de banque générique sans valeur éditoriale.

Ratios de référence lorsqu'ils facilitent la cohérence :

- portrait : `1 / 1` ou `4 / 5` selon le composant ;
- vignette éditoriale : `3 / 2` ;
- schéma explicatif : préserver son intégralité, sans recadrage arbitraire.

Ces ratios décrivent le rendu ; ils ne doivent pas dégrader le fichier source éditorial.

### Iconographie

Ne pas installer de grande bibliothèque d'icônes pour le POC. Utiliser de petits SVG locaux cohérents, de préférence au trait et avec `currentColor`, pour les besoins réels comme menu, lien externe ou LinkedIn.

Réévaluer une bibliothèque uniquement si un nombre significatif d'icônes devient réellement nécessaire.

### Mouvement

Le POC n'utilise pas d'animation au scroll, parallaxe, carrousel automatique ou transition de page décorative.

Les transitions CSS courtes peuvent accompagner un retour d'interaction sur couleur, fond ou bordure. Elles ne sont jamais nécessaires à la compréhension et doivent être neutralisées ou réduites lorsque `prefers-reduced-motion` le demande.

## Responsive et layout

### Stratégie

Le site est **mobile-first**, principalement fluide et intrinsèque. La petite largeur constitue le cas de conception de référence : elle doit être conçue comme une interface à part entière, et non comme une version desktop simplement empilée. Le rendu de base fonctionne sur petite largeur ; les media queries enrichissent la composition lorsque l'espace disponible le permet.

Une largeur de l'ordre de **360 à 390 CSS px** fait partie des vérifications manuelles ordinaires du POC. Cette référence de conception ne remplace pas les exigences d'accessibilité et de reflow applicables aux largeurs plus faibles, au zoom et à l'agrandissement du texte.

Grid et Flexbox doivent résoudre les adaptations naturelles avant d'ajouter une media query.

### Breakpoints de référence

Utiliser seulement deux breakpoints globaux de référence, y compris à travers Tailwind :

- `48rem` : espace suffisant pour certaines compositions à deux colonnes ;
- `72rem` : enrichissement éventuel des grands layouts.

Ces valeurs structurantes doivent être exposées ou utilisées par Tailwind plutôt que de remplacer la stratégie PPC par l'ensemble des breakpoints par défaut de l'outil. Dans le CSS scopé, les custom properties ordinaires n'étant pas utilisables dans les conditions de media queries classiques, ces deux valeurs peuvent être répétées explicitement dans les styles concernés.

Un composant peut ajouter exceptionnellement un breakpoint local si son contenu le justifie réellement. Les breakpoints répondent au contenu, pas à une liste de modèles d'appareils.

### Conteneurs et grilles

- utiliser `--page-gutter` pour les marges latérales ;
- plafonner les lignes de texte avec `--width-reading` ;
- plafonner les sections standard avec `--width-content` ;
- réserver `--width-wide` aux éléments qui en bénéficient réellement ;
- privilégier des grilles intrinsèques (`auto-fit`, `minmax()`) lorsque cela évite un breakpoint artificiel.

Sur très grand écran, le contenu ne s'étire pas indéfiniment.

### Hero

Sur petite largeur, l'ordre logique est : titre, texte, CTA, visuel explicatif. Sur largeur suffisante, le même contenu peut être organisé en deux zones texte/visuel. La version large est une amélioration de la même structure sémantique, pas un second contenu.

### Images et zoom

- images et SVG ne débordent pas de leur conteneur ;
- dimensions connues lorsque possible afin de limiter les décalages de mise en page ;
- pas de hauteur fixe pour un bloc susceptible de contenir du texte variable ;
- le layout doit supporter le zoom et l'agrandissement du texte sans masquer le contenu ;
- **le layout cède avant le contenu**.

## Socle minimal de composants

La bibliothèque du POC reste volontairement petite. La granularité attendue est :

### Structure

- `Header` ;
- `Navigation` ;
- `Footer` ;
- `Breadcrumb` uniquement lorsque la profondeur de navigation le justifie réellement.

### Primitives

- bouton et traitement visuel des CTA ;
- lien ;
- `Tag` / `Badge` ;
- quelques primitives de layout uniquement après constat d'une répétition réelle.

Un lien reste un élément `<a>` et une action reste un `<button>`, même si leur rendu visuel se ressemble.

### Composants sémantiques

- `Hero` ;
- carte Actualité ;
- carte Événement ;
- carte Ressource ;
- carte Référentiel ;
- carte Personne.

Ne pas créer un composant universel `Card` sur-configurable uniquement parce que ces composants partagent une forme rectangulaire. Ils consomment les mêmes tokens mais gardent leur structure métier propre. Factoriser un invariant réel lorsqu'il est identifié par l'implémentation, pas avant.

Le `Hero` répond aux besoins réels du POC : titre, texte, un ou deux CTA et visuel explicatif. Ne pas en faire un page builder ou un composant à de nombreuses variantes spéculatives.

Les blocs éditoriaux ordinaires doivent pouvoir rester du HTML sémantique simple ; ne pas créer un composant Astro pour chaque section textuelle.

## États interactifs et accessibilité du design

L'accessibilité est un invariant du design system, pas une passe finale.

### Focus

Tout contrôle interactif accessible au clavier possède un focus nettement visible. Référence de départ :

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}
```

Ne jamais supprimer l'outline sans fournir un indicateur de focus au moins aussi clair. Le focus ne repose pas uniquement sur un changement de couleur du texte.

### Hover, actif et désactivé

- l'état normal contient toute information nécessaire ;
- `hover` apporte seulement un retour supplémentaire et n'est jamais indispensable ;
- les états actif/sélectionné ou désactivé, lorsqu'ils existent, ne reposent pas uniquement sur la couleur ;
- ne pas afficher artificiellement un bouton désactivé pour une fonction qui n'existe pas encore.

### Liens

Dans un texte courant, un lien doit être identifiable autrement que par sa couleur seule, par exemple avec un soulignement visible. Navigation et CTA peuvent utiliser d'autres conventions lorsque leur contexte les identifie sans ambiguïté.

### Cibles interactives

Viser des zones d'activation confortables, de l'ordre de **44 × 44 CSS px** lorsque le type de contrôle le permet, notamment pour la navigation mobile et les contrôles iconographiques. Une petite icône ne doit pas constituer seule une minuscule zone cliquable.

### Cartes cliquables

Une carte peut offrir une grande zone d'activation lorsqu'elle possède une seule destination principale. Dès qu'elle contient plusieurs actions ou liens, ceux-ci restent explicitement séparés et accessibles.

### Badges, statuts et couleur

Un badge informatif ne ressemble pas à un bouton s'il n'est pas interactif. Les statuts importants sont exprimés textuellement ; la couleur peut renforcer l'information mais ne la porte pas seule.

### Menu mobile

À petite largeur, lorsque le menu est fermé :

- le Header reste compact ;
- l'identité PPC reste visible ;
- un vrai bouton de menu accessible permet d'ouvrir la navigation ;
- la liste complète des rubriques n'occupe pas en permanence le premier viewport ;
- une part significative du contenu principal devient rapidement visible.

Lorsque le menu est ouvert :

- la navigation peut apparaître dans un panneau, un drawer ou un autre pattern responsive conventionnel et accessible ;
- le bouton expose correctement son nom et son état avec `aria-expanded` lorsque pertinent ;
- le menu est utilisable au clavier et au tactile, avec un focus toujours visible ;
- les sous-rubriques peuvent être repliables ;
- aucun comportement ne dépend uniquement du `hover` ;
- le mécanisme reste simple et proportionné.

Une petite interaction TypeScript/JavaScript locale est parfaitement acceptable si elle apporte une meilleure UX ou évite une implémentation HTML/CSS artificiellement complexe. Le menu ne dépend pas d'une animation pour être compréhensible ou utilisable.

À largeur desktop, la navigation principale reste compacte. Les rubriques ayant des enfants peuvent utiliser un dropdown ou un disclosure approprié ; leurs sous-rubriques ne sont pas affichées en permanence si cela augmente inutilement la hauteur du Header. La spécification ne fige pas le choix exact du panneau, drawer, dropdown ou disclosure dès lors que le pattern retenu respecte ces exigences.

### Images et personnes

Les règles d'alternatives textuelles de [`contenu-et-cms.md`](../contenu/contenu-et-cms.md) restent l'autorité pour les modèles de contenu.

Pour une personne :

- le nom est toujours du texte HTML ;
- la photo n'est pas nécessaire à l'identification ;
- un lien LinkedIn est identifiable comme tel ;
- aucune information importante n'est incrustée uniquement dans l'image.

### Dates

Les dates publiques d'actualités et d'événements utilisent l'élément `<time datetime="…">` lorsque pertinent.

### Icônes

Une icône accompagnant un libellé textuel est généralement décorative pour les technologies d'assistance. Une icône utilisée seule comme contrôle possède un nom accessible explicite.

### Principe de résolution des conflits

> Ne jamais diminuer l'accessibilité du HTML pour simplifier l'obtention d'un rendu graphique. Lorsque design visuel et structure sémantique semblent entrer en conflit, adapter le design plutôt que détourner les éléments HTML.

## Réversibilité de la future charte

La future identité de marque PPC doit pouvoir modifier principalement :

- palette et rôles de couleurs ;
- familles et échelle typographiques ;
- rayons et bordures ;
- rythmes d'espacement ;
- densité des sections ;
- traitement des surfaces et interactions ;
- assets identitaires.

Ces évolutions doivent être concentrées dans `tokens.css`, `global.css`, les assets d'identité et, lorsque le langage graphique change structurellement, un petit nombre de primitives/composants. Une refonte de charte ne doit pas nécessiter de parcourir toutes les pages pour remplacer des valeurs de couleur, de police, de rayon ou d'espacement codées en dur.

## Critères d'acceptation lors de l'implémentation

Avant de considérer le front du POC conforme à cette spécification :

- `tokens.css` et `global.css` existent et respectent leurs responsabilités ;
- Tailwind est utilisé comme couche utilitaire de composition sans devenir la source de vérité de la charte ;
- les composants Astro consomment les tokens de charte plutôt que des valeurs locales dupliquées ;
- les styles spécifiques complexes ou propres aux composants restent scopés lorsque cela améliore la lisibilité ;
- le rendu est conçu mobile-first, vérifié ordinairement autour de 360–390 CSS px et reste utilisable aux largeurs plus faibles requises par le reflow ;
- le Header mobile fermé reste compact, conserve l'identité PPC et donne accès à la navigation par un bouton accessible ;
- le menu ouvert et les sous-rubriques restent utilisables au clavier et au tactile sans dépendre du `hover` ;
- les deux breakpoints de référence suffisent par défaut ;
- les principaux composants sont utilisables au clavier et exposent un focus visible ;
- les liens éditoriaux sont reconnaissables autrement que par la couleur seule ;
- les contrastes des états réellement implémentés respectent les critères WCAG AA applicables ;
- `prefers-reduced-motion` est respecté ;
- le site reste compréhensible sans animation et sans hover ;
- le logo utilisé par le site est un asset local, pas un hotlink vers l'ancien site ;
- aucune police distante ni script d'interface tiers n'est nécessaire au rendu de la charte du POC.
