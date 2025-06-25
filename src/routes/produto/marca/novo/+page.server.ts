import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { productBrandSchema } from '$lib/validation/productBrandschema';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(productBrandSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(productBrandSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await query(`INSERT INTO product_brand (nome, ativo) VALUES (?, ?)`, [
				form.data.nome,
				form.data.ativo
			]);
		} catch (error) {
			console.error('Erro ao inserir marca:', error);
			return fail(500, { form, message: 'Não foi possível criar a marca.' });
		}

		throw redirect(303, '/produto/marca/');
	}
};