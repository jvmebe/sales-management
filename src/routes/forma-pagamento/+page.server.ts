import type { PageServerLoad } from "./$types";
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  const paymentMethods = await query('SELECT * FROM payment_method');
  return { paymentMethods };
};
