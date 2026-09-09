import {
  FOURNISSEUR,
  PORTEE_GITHUB,
  type ConfigurationOAuth,
  choisirOrigineCms,
  construireUrlAutorisation,
  creerEtatOAuth,
  creerPkce,
  creerValeurCookie,
  enteteCookie,
  entetesSansCache,
  lireConfigurationOAuth,
  origineService,
} from './_shared/oauth.mts';

export default async function auth(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Méthode non autorisée.', {
      status: 405,
      headers: entetesSansCache({ Allow: 'GET' }),
    });
  }

  let configuration: ConfigurationOAuth;
  try {
    configuration = lireConfigurationOAuth();
  } catch {
    return new Response(
      'Configuration OAuth Netlify incomplète ou CMS_ALLOWED_ORIGINS invalide.',
      { status: 500, headers: entetesSansCache() },
    );
  }

  try {
    const url = new URL(request.url);

    if (url.searchParams.get('provider') !== FOURNISSEUR) {
      return new Response('Fournisseur OAuth non autorisé.', {
        status: 400,
        headers: entetesSansCache(),
      });
    }

    const origineCms = choisirOrigineCms(url.searchParams.get('site_id'), configuration.originesAutorisees);

    const porteeDemandee = url.searchParams.get('scope');
    if (porteeDemandee && porteeDemandee !== PORTEE_GITHUB) {
      return new Response('Portée OAuth non autorisée.', {
        status: 400,
        headers: entetesSansCache(),
      });
    }

    const origineOAuth = origineService(request);
    const callbackUrl = new URL('/callback', origineOAuth).toString();
    const etat = creerEtatOAuth(origineCms, configuration.clientSecret);
    const pkce = creerPkce();
    const urlAutorisation = construireUrlAutorisation({
      clientId: configuration.clientId,
      callbackUrl,
      etat,
      challengePkce: pkce.challenge,
    });
    const entetes = entetesSansCache({ Location: urlAutorisation });
    entetes.set('Set-Cookie', enteteCookie(creerValeurCookie(etat, pkce.verificateur)));

    return new Response(null, { status: 302, headers: entetes });
  } catch {
    return new Response('Requête OAuth invalide ou origine CMS non autorisée.', {
      status: 400,
      headers: entetesSansCache(),
    });
  }
}

export const config = {
  path: '/auth',
  method: 'GET',
};
