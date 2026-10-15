"""Contrôler le format portable ; compléter avec la validation canonique du site."""
import argparse
from datetime import date, datetime
from pathlib import Path
import re
import yaml
from PIL import Image


class Chargeur(yaml.SafeLoader):
    pass


def mapping_unique(loader, node):
    resultat = {}
    for cle, valeur in node.value:
        cle = loader.construct_object(cle)
        if cle in resultat:
            raise ValueError(f'Clé YAML dupliquée : {cle}')
        resultat[cle] = loader.construct_object(valeur)
    return resultat


Chargeur.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, mapping_unique)


def verifier(condition, message):
    if not condition:
        raise ValueError(message)


def valider(fiche):
    fiche = Path(fiche).resolve()
    texte = fiche.read_text(encoding='utf-8')
    parties = re.split(r'^---\s*$', texte, maxsplit=2, flags=re.MULTILINE)
    verifier(len(parties) == 3 and not parties[0].strip(), 'Front matter YAML manquant')
    donnees = yaml.load(parties[1], Loader=Chargeur)
    verifier(isinstance(donnees, dict), 'Objet YAML requis')
    requis = {'titre', 'slug', 'resume', 'date_publication', 'publie', 'image_principale', 'image_alt'}
    autorises = requis | {'date_mise_a_jour'}
    verifier(requis <= donnees.keys(), f'Champs manquants : {requis - donnees.keys()}')
    verifier(donnees.keys() <= autorises, 'Champs inconnus')
    for cle in requis - {'publie', 'date_publication'}:
        verifier(isinstance(donnees[cle], str) and donnees[cle].strip(), f'Chaîne obligatoire : {cle}')
    motif = r'[a-z0-9]+(?:-[a-z0-9]+)*'
    verifier(re.fullmatch(motif, donnees['slug']), 'Slug invalide')
    verifier(re.fullmatch(r'\d{4}-\d{2}-\d{2}-' + motif + r'\.md', fiche.name), 'Nom de fichier invalide')
    datetime.strptime(fiche.name[:10], '%Y-%m-%d')
    verifier(donnees['publie'] is True, 'publie doit être true')
    dates = {}
    for cle in ('date_publication', 'date_mise_a_jour'):
        if cle in donnees:
            valeur = donnees[cle]
            if type(valeur) is date:
                dates[cle] = valeur
            else:
                verifier(isinstance(valeur, str) and re.fullmatch(r'\d{4}-\d{2}-\d{2}', valeur), f'Date YYYY-MM-DD requise : {cle}')
                dates[cle] = date.fromisoformat(valeur)
    if 'date_mise_a_jour' in dates:
        verifier(dates['date_mise_a_jour'] >= dates['date_publication'], 'Mise à jour avant publication')
    chemin = donnees['image_principale']
    verifier(re.fullmatch(r'\.\./medias/images/actualites/[a-z0-9-]+\.webp', chemin), 'Chemin image invalide')
    image = (fiche.parent / chemin).resolve()
    verifier(image.stem == fiche.stem, 'Noms image et fiche différents')
    verifier(image.is_file() and image.stat().st_size <= 300_000, 'Image absente ou supérieure à 300 ko')
    with Image.open(image) as visuel:
        verifier(visuel.format == 'WEBP' and not getattr(visuel, 'is_animated', False), 'WebP fixe requis')
        visuel.verify()
    verifier(bool(parties[2].strip()), 'Corps vide')
    verifier(re.search(r'\[[^\]]+\]\(https?://[^\s)]+\)', parties[2]), 'Lien Markdown vers la source requis dans le corps')
    for autre in fiche.parent.glob('*.md'):
        if autre.resolve() == fiche:
            continue
        morceaux = re.split(r'^---\s*$', autre.read_text(encoding='utf-8'), maxsplit=2, flags=re.MULTILINE)
        if len(morceaux) == 3:
            meta = yaml.load(morceaux[1], Loader=Chargeur)
            verifier(not isinstance(meta, dict) or meta.get('slug') != donnees['slug'], f'Slug déjà utilisé : {autre.name}')
    print(f'Validation portable réussie : {fiche.name}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('fiche')
    valider(parser.parse_args().fiche)
