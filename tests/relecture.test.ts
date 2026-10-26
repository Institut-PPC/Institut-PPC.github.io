import { randomInt } from 'node:crypto';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { stringify } from 'yaml';
import { lireRelectures, schemaRelecture } from '../src/relecture/contenus';
import { verifierRelectures } from '../src/relecture/verifier-dist.mjs';

const livre = {
  identifiant: String(randomInt(0, 1_000_000)).padStart(6, '0'), titre: 'Test de relecture',
  consignes: ['Première ligne\nDeuxième ligne', 'Deuxième paragraphe'],
  url_pdf: 'https://drive.google.com/file/d/test/view',
  url_formulaire: 'https://docs.google.com/forms/d/e/test/viewform?embedded=true',
  commentaires: [{ auteur: 'Nom de test', texte: ['<script>test</script>', 'Autre paragraphe'] }],
};

describe('relectures temporaires', () => {
  it('préserve exactement les textes et refuse les données hors du modèle', () => {
    expect(lireRelectures({ 'test.yaml': stringify(livre) })).toEqual([livre]);
    expect(schemaRelecture.safeParse({ ...livre, email: 'prive@example.org' }).success).toBe(false);
    expect(schemaRelecture.safeParse({ ...livre, commentaires: [{ auteur: 'Nom', texte: ['Texte'], email: 'prive@example.org' }] }).success).toBe(false);
    expect(schemaRelecture.safeParse({ ...livre, identifiant: '012345' }).success).toBe(true);
    for (const identifiant of ['sncf-reseau', 'abc', '../page', '12345', '1234567', 'abcdef', '12345a', 123456]) {
      expect(schemaRelecture.safeParse({ ...livre, identifiant }).success).toBe(false);
    }
    expect(() => lireRelectures({ 'a.yaml': stringify(livre), 'b.yaml': stringify(livre) })).toThrow('b.yaml');
  });

  it('accepte une relecture sans commentaires', () => {
    const { commentaires: _, ...sansCommentaires } = livre;
    expect(lireRelectures({ 'test.yaml': stringify(sansCommentaires) })).toEqual([{ ...sansCommentaires, commentaires: [] }]);
  });

  it('refuse les destinations non prévues et les URL exécutables', () => {
    for (const url_formulaire of ['', 'pas-une-url', 'javascript:alert(1)', 'https://docs.google.com.example.org/forms/d/e/test/viewform?embedded=true', 'https://docs.google.com/forms/d/e/test/edit', 'https://docs.google.com/forms/d/e/test/viewform']) {
      expect(schemaRelecture.safeParse({ ...livre, url_formulaire }).success).toBe(false);
    }
    expect(schemaRelecture.safeParse({ ...livre, url_pdf: 'http://drive.google.com/file/d/test/view' }).success).toBe(false);
  });

  it('exige des listes non vides de paragraphes non vides pour les deux champs', () => {
    for (const valeur of ['Ancien texte simple', [], [''], ['  ']]) {
      expect(schemaRelecture.safeParse({ ...livre, consignes: valeur }).success).toBe(false);
      expect(schemaRelecture.safeParse({ ...livre, commentaires: [{ auteur: 'Nom', texte: valeur }] }).success).toBe(false);
    }
  });

  it('détecte une fuite publique, un sitemap, un index ou un noindex absent', async () => {
    const dossier = await mkdtemp(path.join(tmpdir(), 'ppc-relecture-'));
    try {
      const sousDossier = path.join(dossier, 'relecture', livre.identifiant);
      await mkdir(sousDossier, { recursive: true });
      const fichierPage = path.join(sousDossier, 'index.html');
      await writeFile(fichierPage, '<meta name="robots" content="noindex">');
      expect(await verifierRelectures(dossier)).toEqual([]);
      await writeFile(path.join(dossier, 'index.html'), livre.identifiant);
      await writeFile(path.join(dossier, 'sitemap-0.xml'), `<loc>https://example.org/relecture/${livre.identifiant}/</loc>`);
      await writeFile(path.join(dossier, 'relecture/index.html'), 'Index interdit');
      await writeFile(fichierPage, '<h1>Sans noindex</h1>');
      const erreurs = await verifierRelectures(dossier);
      expect(erreurs.some((erreur: string) => erreur.includes('noindex'))).toBe(true);
      expect(erreurs.some((erreur: string) => erreur.includes('repris dans index.html'))).toBe(true);
      expect(erreurs.some((erreur: string) => erreur.includes('sitemap-0.xml'))).toBe(true);
      expect(erreurs.some((erreur: string) => erreur.includes('inattendue'))).toBe(true);
    } finally {
      await rm(dossier, { recursive: true, force: true });
    }
  });
});
