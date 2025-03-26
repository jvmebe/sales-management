import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  const states = await query('SELECT id, nome, sigla FROM state');
  return { states };
};
