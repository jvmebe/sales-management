// src/routes/cidade/popup/+page.server.ts
import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
  // Consulta as cidades; você pode adicionar junção com estado se quiser mostrar mais informações
  const cities = await query('SELECT id, nome FROM city');
  return { cities };
};
