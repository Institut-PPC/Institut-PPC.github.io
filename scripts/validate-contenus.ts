import process from 'node:process';

import { validerContenus } from '../src/validation/contenus.ts';

const rapport = await validerContenus(process.cwd());

if (rapport.erreurs.length === 0) {
  console.log('Validation des contenus réussie : aucune erreur détectée.');
} else {
  const pluriel = rapport.erreurs.length > 1 ? 's' : '';
  console.error(`Validation des contenus échouée : ${rapport.erreurs.length} erreur${pluriel} détectée${pluriel}.`);
  for (const erreur of rapport.erreurs) {
    console.error(`- ${erreur.chemin} : ${erreur.message}`);
  }
  process.exitCode = 1;
}
