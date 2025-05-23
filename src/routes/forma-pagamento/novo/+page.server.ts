import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { payMethodSchema } from '$lib/validation/paymentSchema';
import {zod} from "sveltekit-superforms/adapters"
import { fail } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(payMethodSchema)),
   }
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(payMethodSchema));
    if (!form.valid) {
      //console.log(form.errors);
      return fail(400, {
        form,
      });
    }

    console.log(form.data);

    await query(
      `INSERT INTO payment_method (descricao) VALUES (?)`,
      [
        form.data.descricao,
      ]
    );
    redirect(303, '/forma-pagamento')
  },
};
