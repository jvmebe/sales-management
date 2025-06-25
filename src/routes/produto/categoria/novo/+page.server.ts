import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { productCategorySchema } from '$lib/validation/productCategorySchema';

export const load: PageServerLoad = async () => {
	// Prepara um formulário vazio usando o schema
	const form = await superValidate(zod(productCategorySchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(productCategorySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await query(
				`INSERT INTO product_category (nome, descricao, ativo) VALUES (?, ?, ?)`,
				[form.data.nome, form.data.descricao, form.data.ativo]
			);
		} catch (error) {
			// Adiciona um log de erro e retorna uma mensagem amigável
			console.error("Erro ao inserir categoria:", error);
			return fail(500, { form, message: 'Não foi possível criar a categoria.' });
		}

		throw redirect(303, '/produto/categoria');
	}
};