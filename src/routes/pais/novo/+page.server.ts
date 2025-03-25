import type { Actions } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const nome = formData.get('nome')?.toString();
    const sigla = formData.get('sigla')?.toString().toUpperCase();

    if (!nome || !sigla || sigla.length !== 2) {
      return { error: 'Nome e sigla (2 letras) são obrigatórios' };
    }

    await query('INSERT INTO country (nome, sigla) VALUES (?, ?)', [nome, sigla]);
    throw redirect(303, '/pais');
  }
};
