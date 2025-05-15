import { json } from '@sveltejs/kit';
import { query } from '$lib/db';

export async function GET() {
  const estados = await query(`
    SELECT * FROM country`);
  return json(estados);
}
