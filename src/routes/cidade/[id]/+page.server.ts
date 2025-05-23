import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';
import { citySchema } from '$lib/validation/citySchema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { fail } from 'sveltekit-superforms';

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

  console.log(city);

  const form = await superValidate(city, zod(citySchema))

  console.log(form)

  return { form, city };
};

export const actions: Actions = {
  default: async (event) => {

    console.log("PARAM:", event.params.id)

    const form = await superValidate(event, zod(citySchema));
    if (!form.valid) {
      //console.log(form.errors);
      return fail(400, {
        form,
      });
    }

    await query(
      `UPDATE city set nome = ?, state_id = ? WHERE id = ?`,
      [
        form.data.nome,
        form.data.state_id,
        event.params.id,
      ]
    );

    redirect(303, '/cidade');
  }
}
