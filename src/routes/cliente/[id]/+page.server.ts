// src/routes/cliente/[id]/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const results = await query(
    `SELECT cl.*, ci.nome as cidade_nome
     FROM client cl
     LEFT JOIN city ci ON cl.cidade_id = ci.id
     WHERE cl.id = ?`,
    [id]
  );
  const client = results[0];

  if (!client) {
    throw error(404, 'Cliente não encontrado');
  }

  return { client };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const actionType = formData.get('action')?.toString();
    const { id } = params;

    if (actionType === 'update') {
      const is_juridica = formData.get('is_juridica') === 'true';
      const is_ativo = formData.get('is_ativo') === 'true';
      const nome = formData.get('nome')?.toString();
      const apelido = formData.get('apelido')?.toString();
      const cpf = formData.get('cpf')?.toString();
      const rg = formData.get('rg')?.toString();
      const data_nascimento = formData.get('data_nascimento')?.toString();
      const telefone = formData.get('telefone')?.toString();
      const email = formData.get('email')?.toString();
      const endereco = formData.get('endereco')?.toString();
      const bairro = formData.get('bairro')?.toString();
      const cep = formData.get('cep')?.toString();
      const cidade_id = formData.get('cidade_id')?.toString();

      if (!nome || !apelido || !cidade_id) {
        return { error: 'Nome, apelido e cidade são obrigatórios.' };
      }

      await query(
        `UPDATE client SET is_juridica = ?, is_ativo = ?, nome = ?, apelido = ?, cpf = ?, rg = ?, data_nascimento = ?, telefone = ?, email = ?, endereco = ?, bairro = ?, cep = ?, cidade_id = ?
         WHERE id = ?`,
        [is_juridica, is_ativo, nome, apelido, cpf, rg, data_nascimento, telefone, email, endereco, bairro, cep, cidade_id, id]
      );
    } else if (actionType === 'delete') {
      await query('DELETE FROM client WHERE id = ?', [id]);
    }
    throw redirect(303, '/cliente');
  }
};
