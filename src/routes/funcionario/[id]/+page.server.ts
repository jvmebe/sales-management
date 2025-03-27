import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const results = await query(
    `SELECT e.*, ci.nome AS cidade_nome
     FROM employee e
     LEFT JOIN city ci ON e.cidade_id = ci.id
     WHERE e.id = ?`,
    [id]
  );
  const employee = results[0];

  if (!employee) {
    throw error(404, 'Funcionário não encontrado');
  }
  return { employee };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const actionType = formData.get('action')?.toString();
    const { id } = params;

    if (actionType === 'update') {
      const nome = formData.get('nome')?.toString();
      const apelido = formData.get('apelido')?.toString();
      const data_nascimento = formData.get('data_nascimento')?.toString();
      const cpf = formData.get('cpf')?.toString();
      const rg = formData.get('rg')?.toString();
      const email = formData.get('email')?.toString();
      const telefone = formData.get('telefone')?.toString();
      const endereco = formData.get('endereco')?.toString();
      const bairro = formData.get('bairro')?.toString();
      const cep = formData.get('cep')?.toString();
      const cidade_id = formData.get('cidade_id')?.toString();
      const ativo = formData.get('ativo') === 'true';
      const matricula = formData.get('matricula')?.toString();
      const cargo = formData.get('cargo')?.toString();
      const salario = parseFloat(formData.get('salario')?.toString() || '0');
      const data_admissao = formData.get('data_admissao')?.toString();
      const turno = formData.get('turno')?.toString();
      const carga_horaria = parseInt(formData.get('carga_horaria')?.toString() || '0');

      if (!nome || !apelido || !cidade_id) {
        return { error: 'Nome, apelido e cidade são obrigatórios.' };
      }

      await query(
        `UPDATE employee
         SET nome = ?, apelido = ?, data_nascimento = ?, cpf = ?, rg = ?, email = ?, telefone = ?, endereco = ?, bairro = ?, cep = ?, cidade_id = ?, ativo = ?, matricula = ?, cargo = ?, salario = ?, data_admissao = ?, turno = ?, carga_horaria = ?
         WHERE id = ?`,
        [nome, apelido, data_nascimento, cpf, rg, email, telefone, endereco, bairro, cep, cidade_id, ativo, matricula, cargo, salario, data_admissao, turno, carga_horaria, id]
      );
    } else if (actionType === 'delete') {
      await query('DELETE FROM employee WHERE id = ?', [id]);
    }
    throw redirect(303, '/funcionario');
  }
};
