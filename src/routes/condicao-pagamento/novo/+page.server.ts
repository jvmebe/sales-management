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
    const form = await superValidate(event, zod(formSchema));
    console.log("error:", form.errors);
    console.log(form.data);
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    let condicao = form.data;

    let parcelas = form.data.parcelas;

    const result:any = await query(
      `INSERT INTO payment_condition (descricao, num_parcelas) VALUES (?, ?)`,
    [condicao.descricao, condicao.num_parcelas]
    )

    for (let i = 0; i < parcelas.length; i++) {
      await query(
        `INSERT INTO payment_installment
         (condicao_id, numero, forma_pagamento_id, valor_porcentagem, dias_vencimento)
         VALUES (?, ?, ?, ?, ?)`,
        [
          result.insertId,
          parcelas[i].numero,
          parcelas[i].forma_pagamento_id,
          parcelas[i].valor_porcentagem,
          parcelas[i].dias_vencimento
        ]
      );
    }


      throw redirect(303, '/condicao-pagamento');
    }
};
