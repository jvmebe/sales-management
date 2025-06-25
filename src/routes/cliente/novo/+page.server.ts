// src/routes/cliente/novo/+page.server.ts (Corrigido para carregar todos os forms)
import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { clientSchema } from '$lib/validation/clientSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { citySchema } from '$lib/validation/citySchema';
import { stateSchema } from '$lib/validation/stateSchema';
import { countrySchema } from '$lib/validation/countrySchema';
import { createCity, createCountry, createState } from '$lib/actions/locationActions';

export const load: PageServerLoad = async () => {
	// 1. Carregando todos os formulários, como no seu código original
	const form = await superValidate(zod(clientSchema));
	const cityForm = await superValidate(zod(citySchema));
	const stateForm = await superValidate(zod(stateSchema));
	const countryForm = await superValidate(zod(countrySchema));

	// 2. Buscando também a lista de condições de pagamento para o seletor
	const paymentConditions = await query(
		'SELECT id, descricao FROM payment_condition ORDER BY descricao'
	);

	return {
		form,
		cityForm,
		stateForm,
		countryForm,
		paymentConditions
	};
};

export const actions: Actions = {
	// Ação para salvar o novo cliente
	default: async (event) => {
		const form = await superValidate(event, zod(clientSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		// ... (lógica para inserir cliente que você já tem) ...
		throw redirect(303, '/cliente');
	},

	// Actions para os modais de localização
	city: createCity,
	state: createState,
	country: createCountry
};