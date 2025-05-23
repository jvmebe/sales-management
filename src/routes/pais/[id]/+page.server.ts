import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';
import { countrySchema } from "$lib/validation/countrySchema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const results = await query('SELECT * FROM country WHERE id = ?', [id]);
  const country = results[0];

  if (!country) {
    throw error(404, 'País não encontrado');
  }

  const form = await superValidate(country, zod(countrySchema));

  return { form, country };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(countrySchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    console.log(form.data);

    await query(
      `UPDATE country SET nome = ?, sigla = ? WHERE id = ?`,
      [form.data.nome, form.data.sigla, event.params.id],
    );

    redirect(303, '/pais');
  }
};
