import type { Root, RootContent, Heading, Text } from 'mdast';
import type { Plugin } from 'unified';

import { extrairePlanReferentiel } from './referentiel-ppc.ts';

type NoeudAvecEnfants = RootContent & { children?: RootContent[] };

function texteDuNoeud(noeud: RootContent): string {
  if (noeud.type === 'text') return (noeud as Text).value;
  return ((noeud as NoeudAvecEnfants).children ?? []).map(texteDuNoeud).join('');
}

function definirId(titre: Heading, id: string): void {
  const data = (titre.data ?? {}) as NonNullable<Heading['data']> & {
    hProperties?: Record<string, string>;
  };
  const proprietes = { ...(data.hProperties ?? {}) };
  delete proprietes.tabindex;
  data.hProperties = {
    ...proprietes,
    id,
  };
  titre.data = data;
}

function echapperHtml(texte: string): string {
  return texte
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function navigationChapitres(plan: ReturnType<typeof extrairePlanReferentiel>, index: number): RootContent[] {
  const precedent = plan[index - 1];
  const suivant = plan[index + 1];
  const liens = [
    precedent
      ? `<a class="chapter-pagination__previous" href="#${precedent.id}" data-chapter-link><span>Chapitre précédent</span>${echapperHtml(precedent.titre)}</a>`
      : '',
    suivant
      ? `<a class="chapter-pagination__next" href="#${suivant.id}" data-chapter-link><span>Chapitre suivant</span>${echapperHtml(suivant.titre)}</a>`
      : '',
  ].join('');

  return [
    { type: 'html', value: `<nav class="chapter-pagination" aria-label="Navigation entre les chapitres">${liens}</nav>` },
    { type: 'html', value: '</section>' },
  ];
}

const remarkReferentielPpc: Plugin<[], Root> = () => (arbre, fichier) => {
  const chemin = String(fichier.path ?? '').replaceAll('\\', '/');
  if (!chemin.endsWith('/contenu/referentiels/ppc/courant.md')) return;

  const markdown = String(fichier.value);
  const plan = extrairePlanReferentiel(markdown);
  const enfants: RootContent[] = [];
  let chapitreIndex = -1;
  let sousSectionIndex = 0;

  for (const noeud of arbre.children) {
    if (noeud.type === 'heading' && noeud.depth === 1) {
      if (chapitreIndex >= 0) {
        enfants.push(...navigationChapitres(plan, chapitreIndex));
      }

      chapitreIndex += 1;
      sousSectionIndex = 0;
      const chapitre = plan[chapitreIndex];
      if (!chapitre) continue;

      enfants.push({
        type: 'html',
        value: `<section class="referentiel-chapter" data-referentiel-chapter="${chapitre.id}" aria-labelledby="${chapitre.id}">`,
      });
      noeud.depth = 2;
      definirId(noeud, chapitre.id);
    } else if (noeud.type === 'heading' && noeud.depth === 2 && chapitreIndex >= 0) {
      const sousSection = plan[chapitreIndex]?.sousSections[sousSectionIndex];
      sousSectionIndex += 1;
      noeud.depth = 3;
      definirId(noeud, sousSection?.id ?? texteDuNoeud(noeud));
    }

    enfants.push(noeud);
  }

  if (chapitreIndex >= 0) enfants.push(...navigationChapitres(plan, chapitreIndex));
  arbre.children = enfants;
};

export default remarkReferentielPpc;
