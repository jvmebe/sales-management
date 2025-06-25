// src/routes/product-category/[id]/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { productCategorySchema } from '$lib/validation/productCategorySchema';

export const load: PageServerLoad = async ({ params }) => {
	const categoryId = parseInt(params.id, 10);
	if (isNaN(categoryId)) {
		throw error(400, 'ID da categoria inválido');
	}

	const results: any[] = await query('SELECT * FROM product_category WHERE id = ?', [categoryId]);
	const category = results[0];

	if (!category) {
		throw error(404, 'Categoria não encontrada');
	}

	const form = await superValidate(category, zod(productCategorySchema));
	return { form, category }; // Retornamos o form e a categoria original para exibir as datas
};

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, zod(productCategorySchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await query(
				`UPDATE product_category SET 
                    nome = ?, 
                    descricao = ?, 
                    ativo = ?, 
                    data_ultima_edicao = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
				[form.data.nome, form.data.descricao, form.data.ativo, event.params.id]
			);
		} catch (e) {
			console.error(e);
			return fail(500, { form, message: 'Não foi possível atualizar a categoria.' });
		}
		throw redirect(303, '/produto/categoria');
	},

	delete: async ({ params }) => {
		try {
			await query('DELETE FROM product_category WHERE id = ?', [params.id]);
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Não foi possível deletar a categoria.' });
		}
		throw redirect(303, '/produto/categoria');
	}
};