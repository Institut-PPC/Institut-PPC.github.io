import { chargerAgenda } from '../lib/agenda-contenus';
export async function GET() {
  return new Response(JSON.stringify(await chargerAgenda()), {headers: {'Content-Type': 'application/json; charset=utf-8'}});
}
