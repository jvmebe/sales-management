import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/validation/citySchema';
import {zod} from "sveltekit-superforms/adapters"
import { fail } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
   }
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      //console.log(form.errors);
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
    return {
      form,
    };
  },
};
