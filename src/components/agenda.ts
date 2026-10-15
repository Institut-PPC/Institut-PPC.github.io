import { indexOngletCible } from './onglets-adhesion';
import { formaterDate } from '../lib/contenus';
import { afficherPlus, classerEvenements, lignesDateNotice, deplacerMois, evenementsDuJour, evenementsDuMois, jourParis, joursDuMois,
  libelleMois, lireEtat, urlEtat, type Agenda, type EtatAgenda, type Notice } from '../lib/agenda';

// textContent préserve les textes éditoriaux sans les interpréter comme du HTML.
function element<K extends keyof HTMLElementTagNameMap>(tag: K, texte = '', classe = '') {
  const noeud = document.createElement(tag); noeud.textContent = texte; noeud.className = classe; return noeud;
}
function notice(n: Notice, evenement: boolean): HTMLElement {
  const article = element('article', '', `agenda-notice ${evenement ? 'event-row' : 'news-card'}`);
  if (!evenement && n.image) {
    const img = element('img'); Object.assign(img, n.image, {loading: 'lazy', decoding: 'async'}); article.append(img);
  }
  const date = element('p', '', 'notice-date');
  const temps = element('time'); temps.dateTime = n.date;
  lignesDateNotice(n, evenement).forEach((ligne, index) => {
    if (index > 0) temps.append(element('br'));
    temps.append(document.createTextNode(ligne));
  });
  date.append(temps); article.append(date);
  const contenu = element('div', '', 'notice-content');
  const titre = element(evenement ? 'h4' : 'h3'); const lien = element('a', n.titre);
  lien.href = `/${evenement ? 'evenements' : 'actualites'}/${n.slug}`; titre.append(lien); contenu.append(titre);
  if (evenement && n.lieu) contenu.append(element('p', n.lieu, 'notice-place'));
  contenu.append(element('p', n.resume));
  if (evenement && n.relation) contenu.append(element('p', n.relation, 'notice-relation'));
  article.append(contenu); return article;
}
export async function initialiserAgenda() {
  const racine = document.querySelector<HTMLElement>('[data-agenda]'); if (!racine) return;
  let donnees: Agenda;
  try {
    const reponse = await fetch('/actualites-evenements.json');
    if (!reponse.ok) return;
    donnees = await reponse.json();
  } catch { return; } // Les listes et liens statiques restent exploitables en cas d’échec.
  const trouver = <T extends HTMLElement = HTMLElement>(selecteur: string) => racine.querySelector<T>(selecteur)!;
  const groupes = {actualites: donnees.actualites, ...classerEvenements(donnees.evenements, donnees.maintenant)};
  let etat = lireEtat(new URL(location.href), history.state?.agenda, new Date().toISOString());
  const sauver = () => history.replaceState({...history.state, agenda: {...etat}, agendaScroll: scrollY}, '', location.href);
  const annoncer = (texte: string) => { trouver('[data-announcement]').textContent = texte; };
  const onglets = Array.from(racine.querySelectorAll<HTMLAnchorElement>('.agenda-tabs a'));
  trouver('.agenda-tabs').setAttribute('role', 'tablist');
  onglets.forEach((onglet, i) => {
    onglet.setAttribute('role', 'tab'); onglet.setAttribute('aria-controls', i ? 'evenements' : 'actualites');
    onglet.addEventListener('click', e => { e.preventDefault(); changer({onglet: i ? 'evenements' : 'actualites'}); });
    onglet.addEventListener('keydown', e => {
      const cible = indexOngletCible(e.key, i, 2); if (cible === undefined) return;
      e.preventDefault(); changer({onglet: cible ? 'evenements' : 'actualites'}); onglets[cible].focus();
    });
  });
  let listesInitialisees = false;
  function rendreListes() {
    for (const cle of ['actualites', 'avenir', 'passes'] as const) {
      const liste = trouver(`[data-list="${cle}"]`);
      if (!listesInitialisees) liste.replaceChildren();
      const nombre = Math.min(etat[cle], groupes[cle].length);
      while (liste.children.length > nombre) liste.lastElementChild!.remove();
      liste.append(...groupes[cle].slice(liste.children.length, nombre).map(n => notice(n, cle !== 'actualites')));
      trouver(`[data-more="${cle}"]`).hidden = etat[cle] >= groupes[cle].length;
    }
    listesInitialisees = true;
  }
  function rendreCalendrier() {
    trouver('[data-month-title]').textContent = libelleMois(etat.mois);
    const grille = trouver('[data-calendar-grid]'); grille.replaceChildren();
    const moisEvenements = evenementsDuMois(donnees.evenements, etat.mois);
    ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.'].forEach(j => grille.append(element('div', j, 'weekday')));
    for (const jour of joursDuMois(etat.mois)) {
      const caseJour = element('div', '', 'calendar-day'); grille.append(caseJour);
      if (!jour) { caseJour.classList.add('outside-month'); continue; }
      const evenements = evenementsDuJour(moisEvenements, jour);
      const bouton = element('button', String(Number(jour.slice(-2))), 'day-number');
      bouton.setAttribute('aria-label', `${formaterDate(jour)} : ${evenements.length} événement${evenements.length > 1 ? 's' : ''}`);
      bouton.setAttribute('aria-pressed', String(etat.jour === jour));
      if (jour === jourParis(new Date())) { bouton.setAttribute('aria-current', 'date'); }
      if (evenements.length) { caseJour.classList.add('has-events'); }
      bouton.addEventListener('click', () => { changer({jour}); trouver('[data-whole-month]').focus(); }); caseJour.append(bouton);
      const titres = element('ul', '', 'day-events');
      evenements.forEach(n => {
        const ligne = element('li'); const lien = element('a', n.titre);
        lien.href = `/evenements/${n.slug}`; ligne.append(lien); titres.append(ligne);
      });
      caseJour.append(titres);
    }
    const evenements = etat.jour ? evenementsDuJour(moisEvenements, etat.jour) : moisEvenements;
    trouver('[data-selection-title]').textContent = etat.jour ? `Événements du ${formaterDate(etat.jour)}` : `Événements de ${libelleMois(etat.mois)}`;
    trouver('[data-whole-month]').hidden = !etat.jour;
    trouver('[data-calendar-list]').replaceChildren(...(evenements.length ? evenements.map(n => notice(n, true)) :
      [element('p', etat.jour ? 'Aucun événement pour cette journée.' : 'Aucun événement ce mois-ci.')]));
  }
  function rendre() {
    onglets.forEach((onglet, i) => {
      const actif = etat.onglet === (i ? 'evenements' : 'actualites');
      onglet.setAttribute('aria-selected', String(actif)); onglet.tabIndex = actif ? 0 : -1;
      const panneau = trouver(i ? '#evenements' : '#actualites');
      panneau.setAttribute('role', 'tabpanel'); panneau.tabIndex = 0; panneau.hidden = !actif;
    });
    trouver('[data-view-controls]').hidden = etat.onglet !== 'evenements';
    racine!.querySelectorAll<HTMLElement>('[data-fallback]').forEach(n => n.hidden = true);
    racine!.querySelectorAll<HTMLElement>('[data-view]').forEach(n => n.setAttribute('aria-pressed', String(n.dataset.view === etat.vue)));
    trouver('[data-event-list]').hidden = etat.vue !== 'liste';
    trouver('[data-calendar]').hidden = etat.vue !== 'calendrier';
    rendreListes(); if (etat.vue === 'calendrier') rendreCalendrier();
  }
  function changer(changements: Partial<EtatAgenda>) {
    if (Object.entries(changements).every(([cle, valeur]) => etat[cle as keyof EtatAgenda] === valeur)) return;
    sauver(); etat = {...etat, ...changements};
    history.pushState({agenda: {...etat}, agendaScroll: scrollY}, '', urlEtat(new URL(location.href), etat));
    rendre();
  }
  racine.querySelectorAll<HTMLButtonElement>('[data-more]').forEach(b => b.addEventListener('click', () => {
    const cle = b.dataset.more as 'actualites' | 'avenir' | 'passes';
    const precedent = Math.min(etat[cle], groupes[cle].length);
    etat = afficherPlus(etat, cle);
    rendreListes(); sauver();
    // Le bouton peut disparaître : le focus rejoint le premier nouveau contenu.
    trouver(`[data-list="${cle}"]`).querySelectorAll<HTMLAnchorElement>('a')[precedent]?.focus({preventScroll: true});
    annoncer(`${Math.min(etat[cle], groupes[cle].length)} contenus affichés sur ${groupes[cle].length}.`);
  }));
  racine.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b => b.addEventListener('click', () => changer({vue: b.dataset.view as EtatAgenda['vue']})));
  racine.querySelectorAll<HTMLButtonElement>('[data-month]').forEach(b => b.addEventListener('click', () => changer({mois: deplacerMois(etat.mois, Number(b.dataset.month)), jour: ''})));
  trouver('[data-today]').addEventListener('click', () => changer({mois: jourParis(new Date()).slice(0,7), jour: ''}));
  trouver('[data-whole-month]').addEventListener('click', () => { changer({jour: ''}); trouver('[data-calendar-grid] button')?.focus(); });
  const restaurer = () => {
    // Une ancre de navigation interne (par exemple le lien d’évitement) ne change pas d’onglet.
    if (location.hash && !['#actualites', '#evenements'].includes(location.hash) && !history.state?.agenda) { sauver(); return; }
    etat = lireEtat(new URL(location.href), history.state?.agenda, new Date().toISOString());
    rendre(); const position = history.state?.agendaScroll;
    if (typeof position === 'number') requestAnimationFrame(() => scrollTo(0, position));
  };
  addEventListener('popstate', restaurer);
  addEventListener('hashchange', restaurer);
  addEventListener('pagehide', sauver);
  // L’état appartient à cette entrée d’historique, sans stockage persistant entre visites.
  let attente = false;
  // Limiter replaceState pendant le défilement évite la limitation de fréquence des navigateurs.
  addEventListener('scroll', () => {
    if (attente) return;
    attente = true;
    setTimeout(() => { sauver(); attente = false; }, 1000);
  }, {passive: true});
  const positionInitiale = history.state?.agendaScroll;
  rendre();
  if (typeof positionInitiale === 'number') requestAnimationFrame(() => scrollTo(0, positionInitiale));
  sauver();
}
