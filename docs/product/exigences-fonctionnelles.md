# Exigences fonctionnelles

## Statut

Périmètre fonctionnel initial du POC. Certaines exigences sont volontairement provisoires car les processus PPC évoluent encore.

## Périmètre fonctionnel

| Fonction | Orientation POC |
|---|---|
| Gestion structurée des contenus via CMS | Requise |
| Actualités / articles | Requis |
| Événements / agenda | Requis |
| Référentiels et documents PPC | Requis, modèle initial simple |
| Présentation de la marque collective | Requise |
| Contact | Page de contact statique |
| Adhésion à l'association | Lien externe |
| Dons | Lien externe |
| Newsletter | CTA externe uniquement |
| Présentation de l'association | Requise |
| Annuaire membres / partenaires / organisations PPC | Préparé pour le futur ; aucune rubrique d'annuaire dans le POC, seulement la gouvernance de l'association |
| Recherche sur le site | Non implémentée ; architecture compatible avec un ajout futur |
| Analytics | Non implémentés |
| Page 404 personnalisée | Requise |

## Contact

Conserver un site statique.

La page Contact doit fournir :
- l'adresse postale de l'association ;
- une adresse e-mail de contact ;
- des indications sur les informations utiles à inclure dans l'e-mail.

Ne pas ajouter de backend ou de service de formulaire externe uniquement pour proposer un formulaire de contact.

## Adhésion et dons

Pour le cœur du POC, utiliser de simples liens vers le service externe de l'association, dans la continuité de l'approche actuelle.

Un formulaire HelloAsso embarqué par iframe ou équivalent pourra éventuellement être testé en fin de POC si cela est utile, mais ne doit pas détourner le projet de ses objectifs principaux.

Les intégrations externes sont évaluées au cas par cas.

## Newsletter

Dans le POC, proposer un simple **CTA vers une page ou un formulaire externe**.

Aucune intégration avec une plateforme d'e-mailing n'est requise.

La fonctionnalité pourra être masquée ou retirée avant la production si l'association ne dispose toujours pas d'une solution de newsletter.

## Actualités et événements

Les actualités et événements servent principalement de **preuve d'activité et de vitalité**, et non de fondation à une plateforme média.

Exigences :
- page centrale commune `/actualites-evenements` ;
- actualités et événements conservés comme deux types de contenus distincts ;
- pages de détail sous `/actualites/<slug>` et `/evenements/<slug>` ;
- conservation des événements passés comme archive ;
- publication structurée simple depuis le CMS ;
- possibilité de faire remonter les contenus récents ou pertinents sur la page d'accueil ou dans des sections contextuelles.

Conserver un système éditorial simple.

## Référentiels et documents

Le modèle initial est volontairement minimal et provisoire.

Une ressource peut notamment comporter :
- titre ;
- courte description ;
- version si pertinente ;
- date de publication/mise à jour ;
- statut si pertinent ;
- catégorie éventuelle ;
- fichier téléchargeable ou lien vers une ressource externe ;
- liens ou documents associés éventuels.

Ne pas inventer un cycle documentaire sophistiqué avant que PPC ne l'ait défini.

## Stockage documentaire

Utiliser un modèle hybride.

Les documents stables faisant partie du site public durable peuvent être stockés et versionnés avec le dépôt puis servis par GitHub Pages. Cela peut inclure les statuts, référentiels publiés, livres blancs finalisés ou ressources institutionnelles stables.

Les documents de travail ou ressources naturellement maintenus ailleurs peuvent rester externes, par exemple un document Google Drive public.

Le modèle de contenu doit donc gérer :
- un fichier hébergé localement ;
- une URL vers une ressource externe.

Le dépôt ne doit pas devenir une GED généraliste.

## Métadonnées de version

Git fournit l'historique technique.

Les contenus publics peuvent également exposer, lorsque cela a du sens :
- date de publication ;
- date de dernière mise à jour ;
- numéro de version ;
- statut.

Ne pas afficher un historique public uniquement parce que Git en possède un.

## Recherche

Aucune recherche dans le POC.

Les contenus et métadonnées doivent être structurés de façon à permettre ultérieurement l'ajout d'une recherche légère sans restructuration du site.

## Analytics

Aucun analytics dans le POC.

L'architecture ne doit pas empêcher l'ajout futur d'une solution légère et respectueuse de la vie privée si l'équipe PPC décide que la mesure d'audience est utile.

## Prévisualisation éditoriale

Une capacité de prévisualisation est souhaitable, notamment pour permettre à la co-présidence d'évaluer l'expérience éditoriale.

Elle doit cependant rester proportionnée. Comparer les options légères lors du choix du CMS. Ne pas introduire une infrastructure importante uniquement pour fournir une preview.

## Gestion des erreurs

Prévoir une page 404 personnalisée, sobre et utile, compatible avec GitHub Pages.

Aucune migration exhaustive des redirections Odoo n'est requise.

## URL publiques

Les URL publiques importantes doivent être :
- simples ;
- sémantiques ;
- lisibles ;
- aussi stables que raisonnablement possible ;
- indépendantes du CMS ou des détails d'implémentation.

Exemples du sitemap retenu : `/association`, `/marque-collective`, `/marque-collective/referentiels`, `/actualites/<slug>`, `/evenements/<slug>`.

Le sitemap, la navigation et le rôle des pages sont spécifiés dans [`architecture-information.md`](architecture-information.md).
