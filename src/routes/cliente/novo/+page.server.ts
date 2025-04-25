import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/validation/clientSchema';
import {zod} from "sveltekit-superforms/adapters"
import { fail } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema),)
   }
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());

    // Coerções para valores numéricos e booleanos
    const data = {
      id: 0, // será ignorado, pois é auto_increment
      is_juridica: formData.is_juridica === 'true',
      is_ativo: formData.is_ativo === 'true',
      nome: formData.nome,
      apelido: formData.apelido,
      cpf: formData.cpf,
      rg: formData.rg,
      data_nascimento: formData.data_nascimento,
      telefone: formData.telefone,
      email: formData.email,
      endereco: formData.endereco,
      numero: parseInt(formData.numero || '0', 10),
      bairro: formData.bairro,
      cep: formData.cep,
      limite_credito: formData.limite_credito,
      cidade_id: parseInt(formData.cidade_id || '0', 10),
      cond_pag_id: parseInt(formData.cond_pag_id || '0', 10)
    };

    // Validação com Zod
    const result = formSchema.omit({ id: true }).safeParse(data);

    if (!result.success) {
      return fail(400, {
        error: 'Dados inválidos',
        details: result.error.flatten()
      });
    }

    const valid = result.data;

    await query(
      `INSERT INTO client (
        is_juridica, is_ativo, nome, apelido, cpf, rg, data_nascimento,
        telefone, email, endereco, numero, bairro, cep,
        limite_credito, cidade_id, cond_pag_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        valid.is_juridica,
        valid.is_ativo,
        valid.nome,
        valid.apelido,
        valid.cpf,
        valid.rg,
        valid.data_nascimento,
        valid.telefone,
        valid.email,
        valid.endereco,
        valid.numero,
        valid.bairro,
        valid.cep,
        valid.limite_credito,
        valid.cidade_id,
        valid.cond_pag_id
      ]
    );

    throw redirect(303, '/cliente');
  }
};
