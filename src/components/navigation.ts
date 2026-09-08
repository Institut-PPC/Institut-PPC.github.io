/** Une seule navigation est déplacée : aucun lien ni état courant n'est dupliqué. */
export function initNavigation(header: HTMLElement) {
  const dialog = header.querySelector<HTMLDialogElement>('dialog')!;
  const trigger = header.querySelector<HTMLButtonElement>('[data-menu-open]')!;
  const closeButton = header.querySelector<HTMLButtonElement>('[data-menu-close]')!;
  const home = header.querySelector<HTMLElement>('[data-navigation-home]')!;
  const panel = header.querySelector<HTMLElement>('[data-navigation-panel]')!;
  const fallback = header.querySelector<HTMLDetailsElement>('[data-navigation-fallback]')!;
  const nav = header.querySelector<HTMLElement>('nav')!;
  // Sans support du dialogue modal, le disclosure HTML reste utilisable.
  if (typeof dialog.showModal !== 'function') return;

  const desktop = window.matchMedia('(min-width: 80rem)');
  const disclosures = Array.from(nav.querySelectorAll('details'));
  let previousOverflow = '';
  let scrollLocked = false;

  function restoreScroll() {
    if (!scrollLocked) return;
    document.documentElement.style.overflow = previousOverflow;
    scrollLocked = false;
  }

  function closeMenu(restoreFocus = true) {
    if (!dialog.open) return;
    dialog.close();
    trigger.setAttribute('aria-expanded', 'false');
    restoreScroll();
    if (restoreFocus) trigger.focus();
  }

  function adaptLayout() {
    const focusWasInMenu = nav.contains(document.activeElement) || dialog.contains(document.activeElement);
    const focusWasOnTrigger = document.activeElement === trigger;
    closeMenu(false);
    disclosures.forEach((item) => { item.open = false; });
    (desktop.matches ? home : panel).append(nav);
    trigger.hidden = desktop.matches;
    // Masquer après le déplacement préserve le focus lors du changement de seuil.
    home.hidden = !desktop.matches;
    if (focusWasInMenu || focusWasOnTrigger) {
      if (desktop.matches) nav.querySelector<HTMLAnchorElement>('a')?.focus();
      else trigger.focus();
    }
  }

  trigger.addEventListener('click', () => {
    previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    scrollLocked = true;
    trigger.setAttribute('aria-expanded', 'true');
    closeButton.focus();
  });
  closeButton.addEventListener('click', () => closeMenu());
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeMenu();
  });
  dialog.addEventListener('close', () => {
    // Un événement close retardé ne doit pas défaire une réouverture immédiate.
    if (dialog.open) return;
    trigger.setAttribute('aria-expanded', 'false');
    restoreScroll();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeMenu();
  });
  nav.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) closeMenu();
  });
  nav.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const opened = disclosures.find((item) => item.open);
    if (!opened) return;
    event.preventDefault();
    event.stopPropagation();
    opened.open = false;
    opened.querySelector('summary')?.focus();
  });
  disclosures.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) disclosures.forEach((other) => { if (other !== item) other.open = false; });
    });
    item.addEventListener('focusout', (event) => {
      if (desktop.matches && !item.contains(event.relatedTarget as Node | null)) item.open = false;
    });
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target as Node)) disclosures.forEach((item) => { item.open = false; });
  });
  desktop.addEventListener('change', adaptLayout);
  adaptLayout();
  fallback.hidden = true;
  header.dataset.enhanced = '';
}
