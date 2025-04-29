import { json } from '@sveltejs/kit';
import { query } from '$lib/db';

export async function GET() {
  const estados = await query(`
    SELECT e.id, e.nome, e.country_id, c.nome AS country_nome, c.sigla AS country_sigla
    FROM state e
    JOIN country c ON e.country_id = c.id
  `);
  return json(estados);
}
