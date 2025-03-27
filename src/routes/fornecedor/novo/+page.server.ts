import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
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
      `INSERT INTO supplier (is_juridico, ativo, nome, apelido, cpf, rg, data_nascimento, email, telefone, endereco, bairro, cep, cidade_id, inscricao_municipal, inscricao_estadual_substituto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [is_juridico, ativo, nome, apelido, cpf, rg, data_nascimento, email, telefone, endereco, bairro, cep, cidade_id, inscricao_municipal, inscricao_estadual_substituto]
    );
    throw redirect(303, '/fornecedor');
  }
};
