const touchesNavigation = new Set(['ArrowLeft', 'ArrowRight', 'Home', 'End']);

export function indexOngletCible(touche: string, indexActif: number, nombreOnglets: number): number | undefined {
  if (nombreOnglets < 1 || !touchesNavigation.has(touche)) return undefined;
  if (touche === 'Home') return 0;
  if (touche === 'End') return nombreOnglets - 1;
  if (touche === 'ArrowLeft') return (indexActif - 1 + nombreOnglets) % nombreOnglets;
  return (indexActif + 1) % nombreOnglets;
}

function chargerWidget(panneau: HTMLElement): void {
  const cadre = panneau.querySelector<HTMLIFrameElement>('iframe[data-widget-helloasso][data-src]');
  const source = cadre?.dataset.src;
  if (!cadre || !source) return;

  cadre.src = source;
  delete cadre.dataset.src;
}

export function initialiserOngletsAdhesion(): void {
  document.querySelectorAll<HTMLElement>('[data-onglets-adhesion]').forEach((racine) => {
    if (racine.dataset.ongletsInitialises === 'true') return;

    const onglets = Array.from(racine.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panneaux = Array.from(racine.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    if (onglets.length === 0 || onglets.length !== panneaux.length) return;

    const activer = (index: number, placerFocus = false) => {
      onglets.forEach((onglet, position) => {
        const actif = position === index;
        onglet.setAttribute('aria-selected', String(actif));
        onglet.tabIndex = actif ? 0 : -1;
        panneaux[position].hidden = !actif;
      });
      chargerWidget(panneaux[index]);
      if (placerFocus) onglets[index].focus();
    };

    onglets.forEach((onglet, index) => {
      onglet.addEventListener('click', () => activer(index));
      onglet.addEventListener('keydown', (evenement) => {
        const cible = indexOngletCible(evenement.key, index, onglets.length);
        if (cible === undefined) return;
        evenement.preventDefault();
        activer(cible, true);
      });
    });

    racine.dataset.ongletsInitialises = 'true';
    racine.classList.add('onglets-actifs');
    activer(0);
  });
}
