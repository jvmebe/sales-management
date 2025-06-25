import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { productBrandSchema } from '$lib/validation/productBrandSchema';

export const load: PageServerLoad = async ({ params }) => {
	const brandId = parseInt(params.id, 10);
	if (isNaN(brandId)) {
		throw error(400, 'ID da marca inválido');
	}

	const results: any[] = await query('SELECT * FROM product_brand WHERE id = ?', [brandId]);
	const brand = results[0];

	if (!brand) {
		throw error(404, 'Marca não encontrada');
	}

	const form = await superValidate(brand, zod(productBrandSchema));
	return { form, brand };
};

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, zod(productBrandSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await query(
				`UPDATE product_brand SET 
                    nome = ?, 
                    ativo = ?, 
                    data_ultima_edicao = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
				[form.data.nome, form.data.ativo, event.params.id]
			);
		} catch (e) {
			console.error(e);
			return fail(500, { form, message: 'Não foi possível atualizar a marca.' });
		}
		throw redirect(303, '/produto/marca/');
	},

	delete: async ({ params }) => {
		try {
			await query('DELETE FROM product_brand WHERE id = ?', [params.id]);
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Não foi possível deletar a marca.' });
		}
		throw redirect(303, '/produto/marca/');
	}
};