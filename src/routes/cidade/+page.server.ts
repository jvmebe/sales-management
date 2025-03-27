import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  // Junta com a tabela de state para exibir o nome e a sigla do Estado
  const cities = await query(`
    SELECT c.id, c.nome, s.nome AS state_nome, s.sigla AS state_sigla
    FROM city c
    JOIN state s ON c.state_id = s.id
  `);
  return { cities };
};
