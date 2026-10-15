# Format évènement PPC

Référence issue du schéma fourni ; consulter le schéma courant du dépôt avant utilisation.

```yaml
---
titre: "Titre officiel de l'évènement"
slug: "titre-evenement"
resume: "Présentation courte reformulée."
date_debut: "2026-11-10T09:30:00+01:00"
date_fin: "2026-11-10T12:00:00+01:00"
relation_ppc: "evenement-externe"
lieu: "Lieu et adresse vérifiés"
lien_externe: "https://exemple.org/evenement"
image: "../medias/images/evenements/2026-10-14-titre-evenement.webp"
image_alt: "Description concrète du visuel"
publie: true
---
```

Les dates de cet exemple sont fictives, ne pas les reprendre. Champs obligatoires du schéma : titre, slug, resume, date_debut, relation_ppc, publie. Pour ce skill, image, image_alt et lien_externe sont également requis. Champs facultatifs : date_fin, lieu, organisations_liees, personnes_liees (listes d'identifiants existants). Ne pas ajouter d'autres champs : le schéma est strict. Les deux seules relations autorisées sont `evenement-externe` et `organise-par-ppc`.

Préfixer le nom du fichier par la date de création, sans sémantique métier ensuite. Le slug détermine la route `/evenements/<slug>`. Vérifier l'unicité dans la collection. Ne pas remplir les champs inconnus avec « à confirmer » ni des valeurs fictives.

Limite de ce skill : 300 000 octets par image, WebP réel et non simple extension renommée. Adapter les dimensions proportionnellement, sans agrandissement ni recadrage arbitraire.
