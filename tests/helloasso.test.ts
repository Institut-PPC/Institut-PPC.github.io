import { describe, expect, it } from 'vitest';

import {
  estHoteHelloAsso,
  extraireHauteurHelloAsso,
  trouverCadreHelloAsso,
} from '../src/components/helloasso';

describe('widgets HelloAsso', () => {
  it('reconnaît uniquement les domaines HelloAsso', () => {
    expect(estHoteHelloAsso('www.helloasso.com')).toBe(true);
    expect(estHoteHelloAsso('helloasso.com')).toBe(true);
    expect(estHoteHelloAsso('helloasso.com.example.org')).toBe(false);
  });

  it('accepte uniquement une hauteur numérique, finie et positive', () => {
    expect(extraireHauteurHelloAsso({ height: 812.2 })).toBe(813);
    expect(extraireHauteurHelloAsso({ height: '812' })).toBeUndefined();
    expect(extraireHauteurHelloAsso({ height: Number.POSITIVE_INFINITY })).toBeUndefined();
    expect(extraireHauteurHelloAsso({ height: 0 })).toBeUndefined();
  });

  it('associe un message au bon widget parmi plusieurs cadres', () => {
    const sourceUn = {} as WindowProxy;
    const sourceDeux = {} as WindowProxy;
    const cadres = [
      { contentWindow: sourceUn, src: 'https://www.helloasso.com/formulaire-un/widget' },
      { contentWindow: sourceDeux, src: 'https://www.helloasso.com/formulaire-deux/widget' },
    ];

    expect(trouverCadreHelloAsso(cadres, sourceDeux, 'https://www.helloasso.com')).toBe(cadres[1]);
    expect(trouverCadreHelloAsso(cadres, sourceDeux, 'https://example.org')).toBeUndefined();
    expect(trouverCadreHelloAsso(cadres, sourceUn, 'https://www.helloasso.com')).toBe(cadres[0]);
  });
});
