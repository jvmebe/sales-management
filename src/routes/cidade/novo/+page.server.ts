import { createCountry, createState } from '$lib/actions/locationActions';
import { query } from '$lib/db';
import { citySchema } from '$lib/validation/citySchema';
import { countrySchema } from '$lib/validation/countrySchema';
import { stateSchema } from '$lib/validation/stateSchema';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {

    const form = await superValidate(zod(citySchema));
    const stateForm = await superValidate(zod(stateSchema));
    const countryForm = await superValidate(zod(countrySchema));
  
    return {
      form, stateForm, countryForm
    };
};

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(citySchema));
    if (!form.valid) {
      console.log(form.errors)
      return fail(400, {
        form,
      });
    }

    console.log(form.data);

    await query(
      `INSERT INTO city (nome, state_id) VALUES (?, ?)`,
      [
        form.data.nome,
        form.data.state_id,
      ]
    );
  },
  state: createState,
  country: createCountry,
};
