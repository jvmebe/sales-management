import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/validation/clientSchema';
import {zod} from "sveltekit-superforms/adapters"
import { fail } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
  return {
      form: await superValidate(zod(formSchema)),
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
