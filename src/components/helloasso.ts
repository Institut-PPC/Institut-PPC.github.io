export interface CadreHelloAsso {
  contentWindow: WindowProxy | null;
  src: string;
}

export function estHoteHelloAsso(hostname: string): boolean {
  return hostname === 'helloasso.com' || hostname.endsWith('.helloasso.com');
}

export function extraireHauteurHelloAsso(donnees: unknown): number | undefined {
  if (typeof donnees !== 'object' || donnees === null || !('height' in donnees)) return undefined;

  const hauteur = donnees.height;
  return typeof hauteur === 'number' && Number.isFinite(hauteur) && hauteur > 0
    ? Math.ceil(hauteur)
    : undefined;
}

export function trouverCadreHelloAsso<T extends CadreHelloAsso>(
  cadres: readonly T[],
  source: MessageEventSource | null,
  origine: string,
): T | undefined {
  return cadres.find((cadre) => {
    if (!cadre.contentWindow || cadre.contentWindow !== source) return false;

    try {
      const url = new URL(cadre.src);
      return url.protocol === 'https:' && estHoteHelloAsso(url.hostname) && url.origin === origine;
    } catch {
      return false;
    }
  });
}

export function initialiserWidgetsHelloAsso(): void {
  const racine = document.documentElement;
  if (racine.dataset.helloassoWidgetsInitialises === 'true') return;
  racine.dataset.helloassoWidgetsInitialises = 'true';

  window.addEventListener('message', (evenement) => {
    const cadres = Array.from(
      document.querySelectorAll<HTMLIFrameElement>('iframe[data-widget-helloasso]'),
    );
    const cadre = trouverCadreHelloAsso(cadres, evenement.source, evenement.origin);
    const hauteur = extraireHauteurHelloAsso(evenement.data);

    if (cadre && hauteur !== undefined) cadre.style.height = `${hauteur}px`;
  });
}
