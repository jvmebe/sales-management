import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const results = await query('SELECT * FROM country WHERE id = ?', [id]);
  const country = results[0];

  if (!country) {
    throw error(404, 'País não encontrado');
  }

  return { country };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const actionType = formData.get('action')?.toString();
    const { id } = params;

    if (actionType === 'update') {
      const nome = formData.get('nome')?.toString();
      const sigla = formData.get('sigla')?.toString().toUpperCase();
      if (!nome || !sigla || sigla.length !== 2) {
        return { error: 'Nome e sigla (2 letras) são obrigatórios' };
      }
      await query('UPDATE country SET nome = ?, sigla = ? WHERE id = ?', [nome, sigla, id]);
    } else if (actionType === 'delete') {
      await query('DELETE FROM country WHERE id = ?', [id]);
    }
    throw redirect(303, '/pais');
  }
};
