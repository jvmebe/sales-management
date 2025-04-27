import { json } from '@sveltejs/kit';
import { query } from '$lib/db';

export async function GET() {
  const conditions = await query('SELECT * FROM payment_condition');

  return json(conditions);
}
