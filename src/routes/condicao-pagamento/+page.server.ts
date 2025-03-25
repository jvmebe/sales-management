// src/routes/condicao-de-pagamento/+page.server.ts
import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  const conditions = await query('SELECT * FROM payment_condition');
  return { conditions };
};
