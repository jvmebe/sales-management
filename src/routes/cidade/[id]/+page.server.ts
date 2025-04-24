import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;

  const results = await query(
    `SELECT c.id, c.nome, c.state_id, s.nome AS state_nome, s.sigla AS state_sigla
     FROM city c
     JOIN state s ON c.state_id = s.id
     WHERE c.id = ?`,
    [id]
  );
  const city = results[0];

  if (!city) {
    throw error(404, 'Cidade não encontrada');
  }

  const form = await superValidate(zod(formSchema),)

  return { form, city };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const actionType = formData.get('action')?.toString();
    const { id } = params;

    console.log(formData);

    if (actionType === 'update') {
      const nome = formData.get('nome')?.toString();
      const state_id = formData.get('state_id')?.toString();
      if (!nome || !state_id) {
        return { error: 'Nome e Estado são obrigatórios' };
      }
      await query('UPDATE city SET nome = ?, state_id = ? WHERE id = ?', [nome, state_id, id]);
    } else if (actionType === 'delete') {
      await query('DELETE FROM city WHERE id = ?', [id]);
    }
    throw redirect(303, '/cidade');
  }
};
