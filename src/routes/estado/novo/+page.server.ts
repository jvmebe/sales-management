import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { stateSchema } from '$lib/validation/stateSchema';
import { countrySchema } from '$lib/validation/countrySchema';
import { superValidate } from 'sveltekit-superforms';
import {zod} from "sveltekit-superforms/adapters"
import { fail } from 'sveltekit-superforms';
import { createCountry, createState } from '$lib/actions/locationActions';

export const load: PageServerLoad = async () => {

  const form = await superValidate(zod(stateSchema));
  const countryForm = await superValidate(zod(countrySchema));

  return { form, countryForm }
};

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(stateSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    console.log(form.data);

    await query(
      `INSERT INTO state (nome, sigla, country_id) VALUES (?, ?, ?)`,
      [
        form.data.nome,
        form.data.sigla,
        form.data.country_id,
      ]
    );
    return {
      form,
    };
  },
  country: createCountry,
};
