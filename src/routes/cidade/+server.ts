import { json } from '@sveltejs/kit';
import { query } from '$lib/db';

export async function GET() {
  const cities = await query('SELECT * FROM city');

  return json(cities);
}
