import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, fail } from 'sveltekit-superforms';
import { formSchema } from '$lib/validation/clientSchema';


export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const results:any = await query(
    `SELECT
          cl.*,
          ci.nome   AS cidade_nome,
          pc.id     AS condicao_pagamento_id,
          pc.descricao AS condicao_pagamento_descricao
        FROM client cl
        LEFT JOIN city ci
          ON cl.cidade_id = ci.id
        LEFT JOIN payment_condition pc
          ON cl.cond_pag_id = pc.id
     WHERE cl.id = ?`,
    [id]
  );
  const client = results[0];

  if (!client) {
    throw error(404, 'Cliente não encontrado');
  }

  client.data_nascimento = client.data_nascimento.toISOString().split('T')[0];

  console.log(client);
  let form = await superValidate(client, zod(formSchema));

  return {
    client, form
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    console.log(form.data)
    if (!form.valid) {
      console.log(form.errors)
      return fail(400, {
        form,
      });
    }

    await query(
      `INSERT INTO client (
        is_juridica, is_ativo, nome, apelido, cpf, rg, data_nascimento,
        telefone, email, endereco, numero, bairro, cep,
        limite_credito, cidade_id, cond_pag_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        form.data.is_juridica,
        form.data.is_ativo,
        form.data.nome,
        form.data.apelido,
        form.data.cpf,
        form.data.rg,
        form.data.data_nascimento,
        form.data.telefone,
        form.data.email,
        form.data.endereco,
        form.data.numero,
        form.data.bairro,
        form.data.cep,
        form.data.limite_credito,
        form.data.cidade_id,
        form.data.cond_pag_id
      ]
    );
    return {
      form,
    };
  },
};
