import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { transportadoraSchema } from '$lib/validation/transportadoraSchema';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const results: any = await query(
		`SELECT t.*, ci.nome AS cidade_nome
     FROM transportadora t
     LEFT JOIN city ci ON t.cidade_id = ci.id
     WHERE t.id = ?`,
		[id]
	);

	const transportadora = results[0];

	if (!transportadora) {
		throw error(404, 'Transportadora não encontrada');
	}

	// Formata a data para o formato YYYY-MM-DD que o input[type=date] espera
	if (transportadora.data_nascimento) {
		transportadora.data_nascimento = new Date(transportadora.data_nascimento)
			.toISOString()
			.split('T')[0];
	}

	const form = await superValidate(transportadora, zod(transportadoraSchema));
	return { form, transportadora };
};

export const actions: Actions = {
	update: async (event) => {
		const { params } = event;
		const form = await superValidate(event, zod(transportadoraSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		form.data.data_nascimento = new Date(form.data.data_nascimento).toISOString().split('T')[0];

		try {
			await query(
				`UPDATE transportadora SET
          is_juridico = ?, ativo = ?, nome = ?, apelido = ?, cpf = ?, rg = ?, data_nascimento = ?,
          email = ?, telefone = ?, endereco = ?, numero = ?, complemento = ?, bairro = ?, cep = ?, cidade_id = ?
        WHERE id = ?`,
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
					params.id
				]
			);
		} catch (e) {
			console.error(e);
			return fail(500, { form, message: 'Não foi possível atualizar a transportadora.' });
		}

		// Em vez de retornar o form, redirecionamos para uma melhor experiência
		throw redirect(303, '/transportadora');
	},
	delete: async ({ params }) => {
		try {
			await query('DELETE FROM transportadora WHERE id = ?', [params.id]);
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Não foi possível deletar a transportadora.' });
		}
		throw redirect(303, '/transportadora');
	}
};