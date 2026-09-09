import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const FOURNISSEUR = 'github';
export const PORTEE_GITHUB = 'public_repo';
export const NOM_COOKIE_OAUTH = '__Host-ppc-cms-oauth';

const DUREE_ETAT_SECONDES = 10 * 60;
const TOLERANCE_HORLOGE_SECONDES = 60;
const PREFIXE_SIGNATURE = 'ppc-decap-oauth-state:';

type EtatOAuth = {
  origine: string;
  emis_a: number;
  nonce: string;
};

export type ConfigurationOAuth = {
  clientId: string;
  clientSecret: string;
  originesAutorisees: string[];
};

export function lireConfigurationOAuth(
  environnement: NodeJS.ProcessEnv = process.env,
): ConfigurationOAuth {
  const clientId = environnement.GITHUB_CLIENT_ID?.trim();
  const clientSecret = environnement.GITHUB_CLIENT_SECRET?.trim();
  const origines = environnement.CMS_ALLOWED_ORIGINS;

  if (!clientId || !clientSecret || !origines) {
    throw new Error('Configuration OAuth incomplète.');
  }

  return {
    clientId,
    clientSecret,
    originesAutorisees: analyserOriginesAutorisees(origines),
  };
}

export function analyserOriginesAutorisees(valeur: string): string[] {
  const origines = valeur
    .split(',')
    .map((origine) => origine.trim())
    .filter(Boolean)
    .map((origine) => {
      const url = new URL(origine);

      if (
        url.protocol !== 'https:' ||
        url.username ||
        url.password ||
        url.pathname !== '/' ||
        url.search ||
        url.hash
      ) {
        throw new Error(`Origine CMS invalide : ${origine}`);
      }

      return url.origin;
    });

  if (origines.length === 0) {
    throw new Error('Aucune origine CMS autorisée.');
  }

  return [...new Set(origines)];
}

export function choisirOrigineCms(siteId: string | null, originesAutorisees: string[]): string {
  if (!siteId) {
    throw new Error('Paramètre site_id absent.');
  }

  const correspondances = originesAutorisees.filter(
    (origine) => new URL(origine).hostname.toLowerCase() === siteId.toLowerCase(),
  );

  if (correspondances.length !== 1) {
    throw new Error('Origine CMS non autorisée.');
  }

  return correspondances[0];
}

function signer(contenu: string, secret: string): string {
  return createHmac('sha256', secret).update(PREFIXE_SIGNATURE).update(contenu).digest('base64url');
}

function egaliteTempsConstant(gauche: string, droite: string): boolean {
  const bufferGauche = Buffer.from(gauche);
  const bufferDroite = Buffer.from(droite);

  return bufferGauche.length === bufferDroite.length && timingSafeEqual(bufferGauche, bufferDroite);
}

export function creerEtatOAuth(
  origine: string,
  secret: string,
  maintenantSecondes = Math.floor(Date.now() / 1000),
  nonce = randomBytes(32).toString('base64url'),
): string {
  const contenu = Buffer.from(
    JSON.stringify({ origine, emis_a: maintenantSecondes, nonce } satisfies EtatOAuth),
  ).toString('base64url');

  return `${contenu}.${signer(contenu, secret)}`;
}

export function verifierEtatOAuth(
  valeur: string,
  secret: string,
  originesAutorisees: string[],
  maintenantSecondes = Math.floor(Date.now() / 1000),
): EtatOAuth {
  const [contenu, signature, supplement] = valeur.split('.');

  if (!contenu || !signature || supplement || !egaliteTempsConstant(signature, signer(contenu, secret))) {
    throw new Error('État OAuth invalide.');
  }

  let etat: unknown;
  try {
    etat = JSON.parse(Buffer.from(contenu, 'base64url').toString('utf8'));
  } catch {
    throw new Error('État OAuth invalide.');
  }

  if (
    typeof etat !== 'object' ||
    etat === null ||
    !('origine' in etat) ||
    !('emis_a' in etat) ||
    !('nonce' in etat) ||
    typeof etat.origine !== 'string' ||
    typeof etat.emis_a !== 'number' ||
    !Number.isInteger(etat.emis_a) ||
    typeof etat.nonce !== 'string' ||
    etat.nonce.length < 32 ||
    !originesAutorisees.includes(etat.origine) ||
    etat.emis_a > maintenantSecondes + TOLERANCE_HORLOGE_SECONDES ||
    maintenantSecondes - etat.emis_a > DUREE_ETAT_SECONDES
  ) {
    throw new Error('État OAuth invalide ou expiré.');
  }

  return etat as EtatOAuth;
}

export function creerPkce(verificateur = randomBytes(32).toString('base64url')): {
  verificateur: string;
  challenge: string;
} {
  if (!/^[A-Za-z0-9._~-]{43,128}$/.test(verificateur)) {
    throw new Error('Vérificateur PKCE invalide.');
  }

  return {
    verificateur,
    challenge: createHash('sha256').update(verificateur).digest('base64url'),
  };
}

export function construireUrlAutorisation(options: {
  clientId: string;
  callbackUrl: string;
  etat: string;
  challengePkce: string;
}): string {
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', options.clientId);
  url.searchParams.set('redirect_uri', options.callbackUrl);
  url.searchParams.set('scope', PORTEE_GITHUB);
  url.searchParams.set('state', options.etat);
  url.searchParams.set('code_challenge', options.challengePkce);
  url.searchParams.set('code_challenge_method', 'S256');
  return url.toString();
}

export function creerValeurCookie(etat: string, verificateurPkce: string): string {
  return Buffer.from(JSON.stringify({ etat, verificateurPkce })).toString('base64url');
}

export function lireValeurCookie(valeur: string | undefined): {
  etat: string;
  verificateurPkce: string;
} {
  if (!valeur) {
    throw new Error('Cookie OAuth absent.');
  }

  try {
    const contenu = JSON.parse(Buffer.from(valeur, 'base64url').toString('utf8')) as unknown;
    if (
      typeof contenu !== 'object' ||
      contenu === null ||
      !('etat' in contenu) ||
      !('verificateurPkce' in contenu) ||
      typeof contenu.etat !== 'string' ||
      typeof contenu.verificateurPkce !== 'string'
    ) {
      throw new Error();
    }

    return { etat: contenu.etat, verificateurPkce: contenu.verificateurPkce };
  } catch {
    throw new Error('Cookie OAuth invalide.');
  }
}

export function lireCookies(entete: string | null): Map<string, string> {
  const cookies = new Map<string, string>();

  for (const fragment of entete?.split(';') ?? []) {
    const separateur = fragment.indexOf('=');
    if (separateur > 0) {
      cookies.set(fragment.slice(0, separateur).trim(), fragment.slice(separateur + 1).trim());
    }
  }

  return cookies;
}

export function enteteCookie(valeur: string, maxAge = DUREE_ETAT_SECONDES): string {
  return `${NOM_COOKIE_OAUTH}=${valeur}; Path=/; Max-Age=${maxAge}; Secure; HttpOnly; SameSite=Lax`;
}

export function origineService(request: Request): string {
  const url = new URL(request.url);
  if (url.protocol !== 'https:') {
    throw new Error('Le service OAuth doit être appelé en HTTPS.');
  }
  return url.origin;
}

export function entetesSansCache(entetes: HeadersInit = {}): Headers {
  const resultat = new Headers(entetes);
  resultat.set('Cache-Control', 'no-store, max-age=0');
  resultat.set('Pragma', 'no-cache');
  resultat.set('Referrer-Policy', 'no-referrer');
  resultat.set('X-Content-Type-Options', 'nosniff');
  return resultat;
}

function chaineJavascript(valeur: string): string {
  return JSON.stringify(valeur).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

export function pageRetourDecap(
  origineCms: string,
  statut: 'success' | 'error',
  donnees: { token: string } | { message: string },
  nonceCsp = randomBytes(18).toString('base64url'),
): { corps: string; csp: string } {
  const message = `authorization:${FOURNISSEUR}:${statut}:${JSON.stringify(donnees)}`;
  const corps = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Authentification PPC</title>
  </head>
  <body>
    <p>Retour vers l’administration des contenus PPC…</p>
    <script nonce="${nonceCsp}">
      (() => {
        const origineCms = ${chaineJavascript(origineCms)};
        const messageFinal = ${chaineJavascript(message)};
        const recevoir = (evenement) => {
          if (evenement.source !== window.opener || evenement.origin !== origineCms || evenement.data !== 'authorizing:github') return;
          window.removeEventListener('message', recevoir);
          window.opener.postMessage(messageFinal, origineCms);
        };
        if (!window.opener) return;
        window.addEventListener('message', recevoir);
        window.opener.postMessage('authorizing:github', origineCms);
      })();
    </script>
  </body>
</html>`;

  return {
    corps,
    csp: `default-src 'none'; script-src 'nonce-${nonceCsp}'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
  };
}

export async function echangerCodeContreToken(options: {
  clientId: string;
  clientSecret: string;
  code: string;
  callbackUrl: string;
  verificateurPkce: string;
  fetcher?: typeof fetch;
}): Promise<string> {
  const fetcher = options.fetcher ?? fetch;
  const reponse = await fetcher('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: options.clientId,
      client_secret: options.clientSecret,
      code: options.code,
      redirect_uri: options.callbackUrl,
      code_verifier: options.verificateurPkce,
    }),
  });

  const resultat = (await reponse.json()) as unknown;
  if (
    !reponse.ok ||
    typeof resultat !== 'object' ||
    resultat === null ||
    !('access_token' in resultat) ||
    typeof resultat.access_token !== 'string' ||
    resultat.access_token.length === 0
  ) {
    throw new Error('Échange OAuth GitHub refusé.');
  }

  return resultat.access_token;
}
