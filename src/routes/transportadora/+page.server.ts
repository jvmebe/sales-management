import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  // Seleciona os dados da transportadora, juntando com a cidade para exibir o nome.
  const transportadoras = await query(`
    SELECT t.id, t.nome, t.apelido, t.email, ci.nome AS cidade_nome
    FROM transportadora t
    LEFT JOIN city ci ON t.cidade_id = ci.id
  `);
  
  return { transportadoras };
};