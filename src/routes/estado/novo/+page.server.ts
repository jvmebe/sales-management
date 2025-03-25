// src/routes/estado/novo/+page.server.ts
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
    const sigla = formData.get('sigla')?.toString().toUpperCase();
    const country_id = formData.get('country_id')?.toString();

    if (!nome || !sigla || !country_id || sigla.length !== 2) {
      return { error: 'Nome, sigla (2 letras) e país são obrigatórios' };
    }

    await query('INSERT INTO state (nome, sigla, country_id) VALUES (?, ?, ?)', [nome, sigla, country_id]);
    throw redirect(303, '/estado');
  }
};
