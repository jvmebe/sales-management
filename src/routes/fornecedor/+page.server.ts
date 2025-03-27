import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  const suppliers = await query(`
    SELECT f.id, f.nome, f.apelido, f.email, ci.nome AS cidade_nome
    FROM supplier f
    LEFT JOIN city ci ON f.cidade_id = ci.id
  `);
  return { suppliers };
};
