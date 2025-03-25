import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  const countries = await query('SELECT * FROM country');
  return { countries };
};
