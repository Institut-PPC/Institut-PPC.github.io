# Format actualité PPC

Référence issue du schéma fourni. Vérifier le schéma courant du dépôt avant utilisation.

```yaml
---
titre: "Une publication consacrée à la PPC"
slug: "publication-ppc"
resume: "Présentation courte et factuelle du sujet traité."
date_publication: "2026-10-15"
image_principale: "../medias/images/actualites/2026-10-15-publication-ppc.webp"
image_alt: "Description concrète de l'illustration"
publie: true
---
```

Valeurs fictives à remplacer. Champs obligatoires du schéma : titre, slug, resume, date_publication, publie. Pour ce skill, image_principale et image_alt sont également requis. Seul autre champ accepté : date_mise_a_jour, facultatif, au format YYYY-MM-DD. Le schéma est strict.

La date de publication est celle de la fiche sur le site PPC, différente de la date de la source relayée. Par défaut, prendre la date courante en Europe/Paris ; une date fournie explicitement par l'utilisateur prévaut. Le préfixe du nom du fichier est la date de création et reste stable ensuite.

Le champ `image_principale` distingue les actualités des évènements, qui utilisent `image`. Ne pas ajouter de champ `lien_externe` ni de métadonnées évènementielles ; mettre le lien source dans le corps :

```markdown
[Lire la publication sur le site de l'organisme](https://exemple.org/publication)
```

Le slug détermine `/actualites/<slug>` et doit être unique dans la collection. Pour de nouveaux fichiers, donner à la fiche et au visuel le même nom de base, en ASCII minuscule et kebab-case.

Le visuel doit être un vrai WebP fixe de 300 000 octets maximum. Adapter les dimensions proportionnellement, sans agrandir ni recadrer arbitrairement. Les exigences de poids et d'image obligatoire sont propres à ce skill, même si le schéma du site accepte d'autres contenus.
