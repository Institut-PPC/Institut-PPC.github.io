import { afterEach, describe, expect, it, vi } from 'vitest';

import auth from '../netlify/functions/auth.mts';
import callback from '../netlify/functions/callback.mts';

import {
  analyserOriginesAutorisees,
  choisirOrigineCms,
  construireUrlAutorisation,
  creerEtatOAuth,
  creerPkce,
  creerValeurCookie,
  echangerCodeContreToken,
  enteteCookie,
  pageRetourDecap,
  verifierEtatOAuth,
} from '../netlify/functions/_shared/oauth.mts';

const ORIGINE_PAGES = 'https://institut-ppc.github.io';
const SECRET = 'secret-de-test-suffisamment-long';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('configuration des origines OAuth', () => {
  it('normalise une liste d’origines HTTPS et retire les doublons', () => {
    expect(
      analyserOriginesAutorisees(
        'https://institut-ppc.github.io, https://ppc.example,https://ppc.example',
      ),
    ).toEqual(['https://institut-ppc.github.io', 'https://ppc.example']);
  });

  it('accepte une casse différente et normalise le hostname', () => {
    expect(analyserOriginesAutorisees('https://Institut-PPC.github.io')).toEqual([ORIGINE_PAGES]);
  });

  it.each([
    'http://institut-ppc.github.io',
    'https://institut-ppc.github.io/admin/',
    'https://institut-ppc.github.io?origine=autre',
  ])('refuse une valeur qui n’est pas une origine HTTPS exacte : %s', (origine) => {
    expect(() => analyserOriginesAutorisees(origine)).toThrow('Origine CMS invalide');
  });

  it('sélectionne uniquement l’origine dont le hostname correspond à site_id', () => {
    expect(
      choisirOrigineCms('Institut-PPC.github.io', [ORIGINE_PAGES, 'https://ppc.example']),
    ).toBe(ORIGINE_PAGES);
    expect(() => choisirOrigineCms('attaquant.example', [ORIGINE_PAGES])).toThrow(
      'Origine CMS non autorisée',
    );
  });
});

describe('état OAuth', () => {
  it('vérifie un état signé, récent et lié à une origine autorisée', () => {
    const etat = creerEtatOAuth(ORIGINE_PAGES, SECRET, 1_000, 'n'.repeat(43));
    expect(verifierEtatOAuth(etat, SECRET, [ORIGINE_PAGES], 1_300)).toEqual({
      origine: ORIGINE_PAGES,
      emis_a: 1_000,
      nonce: 'n'.repeat(43),
    });
  });

  it('refuse un état altéré, expiré ou lié à une origine retirée', () => {
    const etat = creerEtatOAuth(ORIGINE_PAGES, SECRET, 1_000, 'n'.repeat(43));
    expect(() => verifierEtatOAuth(`${etat}x`, SECRET, [ORIGINE_PAGES], 1_100)).toThrow();
    expect(() => verifierEtatOAuth(etat, SECRET, [ORIGINE_PAGES], 1_601)).toThrow();
    expect(() => verifierEtatOAuth(etat, SECRET, ['https://ppc.example'], 1_100)).toThrow();
  });
});

describe('requêtes GitHub OAuth', () => {
  it('construit une autorisation public_repo avec state, callback exact et PKCE S256', () => {
    const pkce = creerPkce('v'.repeat(43));
    const resultat = new URL(
      construireUrlAutorisation({
        clientId: 'client-id',
        callbackUrl: 'https://ppc-oauth.netlify.app/callback',
        etat: 'etat-signe',
        challengePkce: pkce.challenge,
      }),
    );

    expect(resultat.origin + resultat.pathname).toBe('https://github.com/login/oauth/authorize');
    expect(Object.fromEntries(resultat.searchParams)).toMatchObject({
      response_type: 'code',
      client_id: 'client-id',
      redirect_uri: 'https://ppc-oauth.netlify.app/callback',
      scope: 'public_repo',
      state: 'etat-signe',
      code_challenge_method: 'S256',
      code_challenge: pkce.challenge,
    });
  });

  it('refuse une réponse GitHub sans token sans divulguer le détail reçu', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'bad_verification_code' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(
      echangerCodeContreToken({
        clientId: 'client-id',
        clientSecret: SECRET,
        code: 'code',
        callbackUrl: 'https://ppc-oauth.netlify.app/callback',
        verificateurPkce: 'v'.repeat(43),
        fetcher,
      }),
    ).rejects.toThrow('Échange OAuth GitHub refusé');
  });
});

describe('retour vers Decap', () => {
  it('cible uniquement l’origine CMS autorisée dans les échanges postMessage', () => {
    const page = pageRetourDecap(ORIGINE_PAGES, 'success', { token: 'token-de-test' }, 'nonce');
    expect(page.corps).toContain(`const origineCms = \"${ORIGINE_PAGES}\"`);
    expect(page.corps).toContain("evenement.origin !== origineCms");
    expect(page.corps).toContain("window.opener.postMessage(messageFinal, origineCms)");
    expect(page.corps).not.toContain("postMessage(messageFinal, '*')");
    expect(page.csp).toContain("script-src 'nonce-nonce'");
  });
});

describe('fonctions Netlify', () => {
  function configurerEnvironnement() {
    vi.stubEnv('GITHUB_CLIENT_ID', 'client-id');
    vi.stubEnv('GITHUB_CLIENT_SECRET', SECRET);
    vi.stubEnv('CMS_ALLOWED_ORIGINS', ORIGINE_PAGES);
  }

  it('redirige /auth vers GitHub et pose une corrélation protégée', async () => {
    configurerEnvironnement();
    const reponse = await auth(
      new Request(
        'https://ppc-oauth.netlify.app/auth?provider=github&site_id=institut-ppc.github.io&scope=public_repo',
      ),
    );

    expect(reponse.status).toBe(302);
    expect(reponse.headers.get('location')).toMatch(/^https:\/\/github\.com\/login\/oauth\/authorize\?/);
    expect(reponse.headers.get('set-cookie')).toContain(
      '__Host-ppc-cms-oauth=',
    );
    expect(reponse.headers.get('set-cookie')).toContain('Secure; HttpOnly; SameSite=Lax');
    expect(reponse.headers.get('access-control-allow-origin')).toBeNull();
  });

  it('échange un callback corrélé et renvoie le protocole Decap à l’origine exacte', async () => {
    configurerEnvironnement();
    const etat = creerEtatOAuth(ORIGINE_PAGES, SECRET);
    const pkce = creerPkce('v'.repeat(43));
    const valeurCookie = creerValeurCookie(etat, pkce.verificateur);
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({ access_token: 'token-de-test', token_type: 'bearer' }),
    );
    vi.stubGlobal('fetch', fetcher);

    const reponse = await callback(
      new Request(`https://ppc-oauth.netlify.app/callback?code=code-test&state=${etat}`, {
        headers: { Cookie: enteteCookie(valeurCookie) },
      }),
    );
    const corps = await reponse.text();

    expect(reponse.status).toBe(200);
    expect(corps).toContain('authorization:github:success');
    expect(corps).toContain('token-de-test');
    expect(corps).toContain(`const origineCms = \"${ORIGINE_PAGES}\"`);
    expect(reponse.headers.get('cache-control')).toContain('no-store');
    expect(reponse.headers.get('content-security-policy')).toContain("default-src 'none'");
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it('refuse un callback non corrélé avant tout échange avec GitHub', async () => {
    configurerEnvironnement();
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const etat = creerEtatOAuth(ORIGINE_PAGES, SECRET);

    const reponse = await callback(
      new Request(`https://ppc-oauth.netlify.app/callback?code=code-test&state=${etat}`),
    );

    expect(reponse.status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
});
