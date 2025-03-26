import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const nome = formData.get('nome')?.toString();
    const state_id = formData.get('state_id')?.toString();

    if (!nome || !state_id) {
      return { error: 'Nome e Estado são obrigatórios' };
    }

    await query('INSERT INTO city (nome, state_id) VALUES (?, ?)', [nome, state_id]);
    throw redirect(303, '/cidade');
  }
};
