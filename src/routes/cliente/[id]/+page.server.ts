// src/routes/cliente/[id]/+page.server.ts (Refatorado)
import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { clientSchema } from '$lib/validation/clientSchema';
import { citySchema } from '$lib/validation/citySchema';
import { stateSchema } from '$lib/validation/stateSchema';
import { countrySchema } from '$lib/validation/countrySchema';
import { payCondSchema } from '$lib/validation/paycondSchema';
import { createCity, createCountry, createState } from '$lib/actions/locationActions';

export const load: PageServerLoad = async ({ params }) => {
	const clientId = parseInt(params.id, 10);
	if (isNaN(clientId)) {
		throw error(400, 'ID de cliente inválido');
	}

	// Busca o cliente específico e os nomes relacionados
	const results: any[] = await query(
		`SELECT
            cl.*,
            ci.nome AS cidade_nome,
            pc.descricao AS cond_pag_descricao
        FROM client cl
        LEFT JOIN city ci ON cl.cidade_id = ci.id
        LEFT JOIN payment_condition pc ON cl.cond_pag_id = pc.id
        WHERE cl.id = ?`,
		[clientId]
	);
	const client = results[0];

	if (!client) {
		throw error(404, 'Cliente não encontrado');
	}

	// Formata a data para o input
	if (client.data_nascimento) {
		client.data_nascimento = new Date(client.data_nascimento).toISOString().split('T')[0];
	}

	// Prepara todos os formulários necessários
	const form = await superValidate(client, zod(clientSchema));
	const cityForm = await superValidate(zod(citySchema));
	const stateForm = await superValidate(zod(stateSchema));
	const countryForm = await superValidate(zod(countrySchema));
	const paymentConditionForm = await superValidate(zod(payCondSchema));

	return { form, client, cityForm, stateForm, countryForm, paymentConditionForm };
};

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, zod(clientSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { id, ...dataToUpdate } = form.data;

		// Adiciona o campo data_ultima_edicao no UPDATE
		await query(
			`UPDATE client SET
                is_juridica = ?, is_ativo = ?, nome = ?, apelido = ?, cpf = ?, rg = ?, data_nascimento = ?, 
                telefone = ?, email = ?, endereco = ?, numero = ?, bairro = ?, cep = ?, limite_credito = ?, 
                cidade_id = ?, cond_pag_id = ?, data_ultima_edicao = CURRENT_TIMESTAMP
            WHERE id = ?`,
			[
				dataToUpdate.is_juridica, dataToUpdate.is_ativo, dataToUpdate.nome, dataToUpdate.apelido,
				dataToUpdate.cpf, dataToUpdate.rg, dataToUpdate.data_nascimento, dataToUpdate.telefone,
				dataToUpdate.email, dataToUpdate.endereco, dataToUpdate.numero, dataToUpdate.bairro,
				dataToUpdate.cep, dataToUpdate.limite_credito, dataToUpdate.cidade_id,
				dataToUpdate.cond_pag_id, event.params.id
			]
		);
		throw redirect(303, '/cliente');
	},
	delete: async ({ params }) => {
		await query('DELETE FROM client WHERE id = ?', [params.id]);
		throw redirect(303, '/cliente');
	},
	// Actions para os modais
	city: createCity,
	state: createState,
	country: createCountry
	// A action para criar condição de pagamento também pode ser adicionada aqui se necessário
};

