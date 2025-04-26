import type { PageServerLoad } from './$types';
import { Client } from '$lib/models';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  const clients = await query(`
    SELECT cl.id, cl.nome, cl.email, ci.nome AS cidade_nome
    FROM client cl
    LEFT JOIN city ci ON cl.cidade_id = ci.id
  `);

  return { clients };

};
