import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { productUnitSchema } from '$lib/validation/productUnitSchema';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(productUnitSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(productUnitSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await query(`INSERT INTO product_unit (nome, sigla, ativo) VALUES (?, ?, ?)`, [
				form.data.nome,
				form.data.sigla,
				form.data.ativo
			]);
		} catch (error) {
			console.error('Erro ao inserir unidade de medida:', error);
			return fail(500, { form, message: 'Não foi possível criar a unidade.' });
		}

		// Redireciona para a lista no caminho correto
		throw redirect(303, '/produto/unidade-medida');
	}
};