// src/routes/estado/novo/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { stateSchema } from '$lib/validation/stateSchema';
import { superValidate } from 'sveltekit-superforms';
import {zod} from "sveltekit-superforms/adapters"
import { fail } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(stateSchema)),
   }
};

export const actions: Actions = {
  default: async (event) => {
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
};
