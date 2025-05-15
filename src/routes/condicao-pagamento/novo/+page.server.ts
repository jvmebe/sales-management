// src/routes/condicao-de-pagamento/novo/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/validation/paycondSchema';
import {zod} from "sveltekit-superforms/adapters"
import { fail } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
  const paymentMethods = await query('SELECT * FROM payment_method');

  return { paymentMethods, form: await superValidate(zod(formSchema)) };
};

export const actions: Actions = {
  default: async (event) => {
    console.log("WHYYYYYYYYYYYYYYYYY");
    const form = await superValidate(event, zod(formSchema));
    console.log("error:", form.errors);
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }


      throw redirect(303, '/condicao-de-pagamento');
    }
};
