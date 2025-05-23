import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, fail } from 'sveltekit-superforms';
import { countrySchema } from '$lib/validation/countrySchema';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(countrySchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(countrySchema));
    console.log(form.data)
    if (!form.valid) {
      console.log(form.errors)
      return fail(400, {
        form,
      });
    }

    await query(
      `INSERT INTO country (
        nome, sigla
      ) VALUES (?, ?)`,
      [
        form.data.nome,
        form.data.sigla,
      ]
    );
    redirect(303, '/pais');
  },
};
