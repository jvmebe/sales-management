// src/routes/produto/[id]/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { productSchema } from '$lib/validation/productSchema';

export const load: PageServerLoad = async ({ params }) => {
	const productId = parseInt(params.id, 10);
	if (isNaN(productId)) {
		throw error(400, 'ID do produto inválido');
	}

	const productResult: any[] = await query('SELECT * FROM product WHERE id = ?', [productId]);
	const product = productResult[0];

	if (!product) {
		throw error(404, 'Produto não encontrado');
	}

	const form = await superValidate(product, zod(productSchema));

	// Também buscamos as listas para preencher os menus suspensos na edição
	const brands = await query('SELECT id, nome FROM product_brand WHERE ativo = TRUE ORDER BY nome');
	const categories = await query(
		'SELECT id, nome FROM product_category WHERE ativo = TRUE ORDER BY nome'
	);
	const units = await query('SELECT id, nome, sigla FROM product_unit WHERE ativo = TRUE ORDER BY nome');
	const suppliers = await query('SELECT id, nome FROM supplier WHERE ativo = TRUE ORDER BY nome');

	return { form, product, brands, categories, units, suppliers };
};

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, zod(productSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { id, ...dataToUpdate } = form.data;

		try {
			await query(
				`UPDATE product SET 
                    nome = ?, descricao = ?, codigo_barras = ?, brand_id = ?, category_id = ?, unit_id = ?, supplier_id = ?,
                    valor_compra = ?, valor_venda = ?, percentual_lucro = ?, estoque = ?, ativo = ?,
                    data_ultima_edicao = CURRENT_TIMESTAMP
                WHERE id = ?`,
				[
					dataToUpdate.nome,
					dataToUpdate.descricao,
					dataToUpdate.codigo_barras,
					dataToUpdate.brand_id,
					dataToUpdate.category_id,
					dataToUpdate.unit_id,
					dataToUpdate.supplier_id,
					dataToUpdate.valor_compra,
					dataToUpdate.valor_venda,
					dataToUpdate.percentual_lucro,
					dataToUpdate.estoque,
					dataToUpdate.ativo,
					event.params.id
				]
			);
		} catch (e) {
			console.error(e);
			return fail(500, { form, message: 'Não foi possível atualizar o produto.' });
		}
		throw redirect(303, '/produto');
	},
	delete: async ({ params }) => {
		try {
			await query('DELETE FROM product WHERE id = ?', [params.id]);
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Não foi possível deletar o produto.' });
		}
		throw redirect(303, '/produto');
	}
};