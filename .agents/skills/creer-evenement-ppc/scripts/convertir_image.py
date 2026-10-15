"""Convertir un visuel local sans modifier son contenu ni écraser une cible."""
import argparse
import io
from pathlib import Path
from PIL import Image, ImageOps


def convertir(source, cible):
    cible = Path(cible)
    if cible.suffix.lower() != '.webp':
        raise ValueError('La cible doit être un fichier .webp')
    if cible.exists():
        raise FileExistsError(f'Cible déjà présente : {cible}')
    with Image.open(source) as image:
        if getattr(image, 'is_animated', False):
            raise ValueError('Image animée : demander un visuel fixe.')
        image = ImageOps.exif_transpose(image)
        image = image.convert('RGBA' if 'A' in image.getbands() or 'transparency' in image.info else 'RGB')
        for largeur in (1600, 1400, 1200, 1000, 800, 640):
            variante = image.copy()
            variante.thumbnail((largeur, largeur), Image.Resampling.LANCZOS)
            for qualite in (90, 85, 80, 75, 70, 65, 60):
                sortie = io.BytesIO()
                variante.save(sortie, format='WEBP', quality=qualite, method=6)
                contenu = sortie.getvalue()
                if len(contenu) <= 300_000:
                    cible.parent.mkdir(parents=True, exist_ok=True)
                    with cible.open('xb') as fichier:
                        fichier.write(contenu)
                    print(f'{cible} : {len(contenu)} octets, {variante.width}×{variante.height}, qualité {qualite}')
                    return
    raise ValueError('Impossible de respecter 300 ko avec une qualité acceptable ; fournir un autre visuel.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source')
    parser.add_argument('cible')
    args = parser.parse_args()
    convertir(args.source, args.cible)
