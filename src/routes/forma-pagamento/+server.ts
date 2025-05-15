import { json } from '@sveltejs/kit';
import { query } from '$lib/db';

export async function GET() {
  const payForm = await query(`SELECT * FROM payment_method`);

  return json(payForm) ;
}
