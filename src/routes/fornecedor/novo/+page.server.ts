import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/validation/supplierSchema';
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

    const date = new Date(form.data.data_nascimento);
    console.log(date);
    form.data.data_nascimento = date.toISOString().split("T")[0];

    await query(
      `INSERT INTO sale_system.supplier
      (is_juridica, ativo, nome, apelido, cpf, rg, data_nascimento, email, telefone, endereco, numero, complemento, bairro, cep, cidade_id, inscricao_estadual_substituto_tributario)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        form.data.is_juridica,
        form.data.ativo,
        form.data.nome,
        form.data.apelido,
        form.data.cpf,
        form.data.rg,
        form.data.data_nascimento,
        form.data.email,
        form.data.telefone,
        form.data.endereco,
        form.data.numero,
        form.data.complemento,
        form.data.bairro,
        form.data.cep,
        form.data.cidade_id,
        form.data.inscricao_estadual_substituto_tributario,
      ]
    );
    return {
      form,
    }
  }
}
