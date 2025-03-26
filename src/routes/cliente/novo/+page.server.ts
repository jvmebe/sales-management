import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
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
      `INSERT INTO client (is_juridica, is_ativo, nome, apelido, cpf, rg, data_nascimento, telefone, email, endereco, bairro, cep, cidade_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [is_juridica, is_ativo, nome, apelido, cpf, rg, data_nascimento, telefone, email, endereco, bairro, cep, cidade_id]
    );
    throw redirect(303, '/cliente');
  }
};
