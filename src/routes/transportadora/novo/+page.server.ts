import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { transportadoraSchema } from '$lib/validation/transportadoraSchema';

export const load: PageServerLoad = async () => {
  // Inicializa o formulário vazio com o schema da transportadora
  const form = await superValidate(zod(transportadoraSchema));
  return { form };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(transportadoraSchema));

    if (!form.valid) {
      // Se o formulário não for válido, retorna os erros para a página
      return fail(400, { form });
    }

    // Formata a data para o formato YYYY-MM-DD do banco de dados
    const date = new Date(form.data.data_nascimento);
    form.data.data_nascimento = date.toISOString().split("T")[0];

    try {
      await query(
        `INSERT INTO transportadora (
          is_juridico, ativo, nome, apelido, cpf, rg, data_nascimento,
          email, telefone, endereco, numero, complemento, bairro, cep, cidade_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          form.data.is_juridico,
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
        ]
      );
    } catch (error) {
      // Em caso de erro no banco de dados, retorna uma mensagem de falha
      console.error("Erro ao inserir transportadora:", error);
      return fail(500, { form, message: 'Não foi possível criar a transportadora.' });
    }

    // Redireciona para a página de listagem após o sucesso da inserção
    throw redirect(303, '/transportadora');
  },
};