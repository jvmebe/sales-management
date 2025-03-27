import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';

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
  return { supplier };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const actionType = formData.get('action')?.toString();
    const { id } = params;

    if (actionType === 'update') {
      const is_juridico = formData.get('is_juridico') === 'true';
      const ativo = formData.get('ativo') === 'true';
      const nome = formData.get('nome')?.toString();
      const apelido = formData.get('apelido')?.toString();
      const cpf = formData.get('cpf')?.toString();
      const rg = formData.get('rg')?.toString();
      const data_nascimento = formData.get('data_nascimento')?.toString();
      const email = formData.get('email')?.toString();
      const telefone = formData.get('telefone')?.toString();
      const endereco = formData.get('endereco')?.toString();
      const bairro = formData.get('bairro')?.toString();
      const cep = formData.get('cep')?.toString();
      const cidade_id = formData.get('cidade_id')?.toString();
      const inscricao_municipal = formData.get('inscricao_municipal')?.toString();
      const inscricao_estadual_substituto = formData.get('inscricao_estadual_substituto')?.toString();

      if (!nome || !apelido || !cidade_id) {
        return { error: 'Nome, apelido e cidade são obrigatórios.' };
      }

      await query(
        `UPDATE supplier
         SET is_juridico = ?, ativo = ?, nome = ?, apelido = ?, cpf = ?, rg = ?, data_nascimento = ?, email = ?, telefone = ?, endereco = ?, bairro = ?, cep = ?, cidade_id = ?, inscricao_municipal = ?, inscricao_estadual_substituto = ?
         WHERE id = ?`,
        [is_juridico, ativo, nome, apelido, cpf, rg, data_nascimento, email, telefone, endereco, bairro, cep, cidade_id, inscricao_municipal, inscricao_estadual_substituto, id]
      );
    } else if (actionType === 'delete') {
      await query('DELETE FROM supplier WHERE id = ?', [id]);
    }
    throw redirect(303, '/fornecedor');
  }
};
