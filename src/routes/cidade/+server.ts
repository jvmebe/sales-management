import { json } from '@sveltejs/kit';
import { query } from '$lib/db';

export async function GET() {
  const cities = await query(`
    SELECT c.id, c.nome, s.nome AS state_nome, s.sigla AS state_sigla
    FROM city c
    JOIN state s ON c.state_id = s.id
  `);

  return json(cities) ;
}
