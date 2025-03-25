import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  const estados = await query(`
    SELECT e.id, e.nome, e.country_id, c.nome AS country_nome, c.sigla AS country_sigla
    FROM state e
    JOIN country c ON e.country_id = c.id
  `);
  return { estados };
};
