import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  const cities = await query(`
    SELECT
      c.id,
      c.nome     AS city_nome,
      s.nome     AS state_nome
    FROM city c
    JOIN state s
      ON c.state_id = s.id
  `);

  return { cities };
};
