import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from '$lib/validation/supplierSchema';
import {zod} from "sveltekit-superforms/adapters"
import { fail } from 'sveltekit-superforms';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const results = await query(
    `SELECT f.*, ci.nome AS cidade_nome
     FROM supplier f
     LEFT JOIN city ci ON f.cidade_id = ci.id
     WHERE f.id = ?`,
    [id]
  );
  const supplier = results[0];
  if (!supplier) {
    throw error(404, 'Fornecedor não encontrado');
  }

  supplier.data_nascimento = supplier.data_nascimento.toISOString().split('T')[0];

  console.log(supplier);
  let form = await superValidate(supplier, zod(formSchema));

  return {
    supplier, form
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    console.log(form.data);

    if (!form.valid) {
      console.log(form.errors);
      return fail(400, { form });
    }

    // Get ID from URL parameters
    const id = Number(event.params.id);
    if (!id || isNaN(id)) {
      return fail(400, { message: "ID inválido" });
    }

    // Format the date properly
    const date = new Date(form.data.data_nascimento);
    form.data.data_nascimento = date.toISOString().split("T")[0];

    await query(
      `UPDATE sale_system.supplier
       SET is_juridica = ?, ativo = ?, nome = ?, apelido = ?, cpf = ?, rg = ?, data_nascimento = ?,
           email = ?, telefone = ?, endereco = ?, numero = ?, complemento = ?, bairro = ?, cep = ?,
           cidade_id = ?, inscricao_estadual_substituto_tributario = ?
       WHERE id = ?`,
      [
        form.data.is_juridica,
        form.data.ativo,
        form.data.nome,
        form.data.apelido,
        form.data.cpf ?? null,
        form.data.rg ?? null,
        form.data.data_nascimento,
        form.data.email ?? null,
        form.data.telefone ?? null,
        form.data.endereco ?? null,
        form.data.numero ?? null,
        form.data.complemento ?? null,
        form.data.bairro ?? null,
        form.data.cep ?? null,
        form.data.cidade_id ?? null,
        form.data.inscricao_estadual_substituto_tributario,
        id, // WHERE id = ?
      ]
    );

    return { form };
  }
}
