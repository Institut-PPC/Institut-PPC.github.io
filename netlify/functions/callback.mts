import {
  NOM_COOKIE_OAUTH,
  echangerCodeContreToken,
  enteteCookie,
  entetesSansCache,
  lireConfigurationOAuth,
  lireCookies,
  lireValeurCookie,
  origineService,
  pageRetourDecap,
  verifierEtatOAuth,
} from './_shared/oauth.mts';

function reponseDecap(
  origineCms: string,
  statut: 'success' | 'error',
  donnees: { token: string } | { message: string },
): Response {
  const page = pageRetourDecap(origineCms, statut, donnees);
  const entetes = entetesSansCache({
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': page.csp,
  });
  entetes.set('Set-Cookie', enteteCookie('', 0));
  return new Response(page.corps, { status: 200, headers: entetes });
}

export default async function callback(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Méthode non autorisée.', {
      status: 405,
      headers: entetesSansCache({ Allow: 'GET' }),
    });
  }

  try {
    const configuration = lireConfigurationOAuth();
    const url = new URL(request.url);
    const etatRecu = url.searchParams.get('state');
    if (!etatRecu) {
      throw new Error('État OAuth absent.');
    }

    origineService(request);
    const etat = verifierEtatOAuth(
      etatRecu,
      configuration.clientSecret,
      configuration.originesAutorisees,
    );
    const cookie = lireValeurCookie(lireCookies(request.headers.get('cookie')).get(NOM_COOKIE_OAUTH));
    if (cookie.etat !== etatRecu) {
      throw new Error('État OAuth non corrélé.');
    }

    const erreurGithub = url.searchParams.get('error');
    if (erreurGithub) {
      return reponseDecap(etat.origine, 'error', {
        message:
          erreurGithub === 'access_denied'
            ? 'Autorisation GitHub annulée.'
            : 'GitHub a refusé l’authentification.',
      });
    }

    const code = url.searchParams.get('code');
    if (!code) {
      return reponseDecap(etat.origine, 'error', { message: 'Code OAuth GitHub absent.' });
    }

    try {
      const callbackUrl = new URL('/callback', new URL(request.url).origin).toString();
      const token = await echangerCodeContreToken({
        clientId: configuration.clientId,
        clientSecret: configuration.clientSecret,
        code,
        callbackUrl,
        verificateurPkce: cookie.verificateurPkce,
      });
      return reponseDecap(etat.origine, 'success', { token });
    } catch {
      return reponseDecap(etat.origine, 'error', {
        message: 'Impossible de terminer l’authentification GitHub.',
      });
    }
  } catch {
    return new Response('Retour OAuth invalide ou expiré.', {
      status: 400,
      headers: entetesSansCache({ 'Content-Type': 'text/plain; charset=utf-8' }),
    });
  }
}

export const config = {
  path: '/callback',
  method: 'GET',
};
