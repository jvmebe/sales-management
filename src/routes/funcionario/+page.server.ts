import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  const employees = await query(`
    SELECT e.id, e.nome, e.apelido, e.email, ci.nome AS cidade_nome
    FROM employee e
    LEFT JOIN city ci ON e.cidade_id = ci.id
  `);
  return { employees };
};
