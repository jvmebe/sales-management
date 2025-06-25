// src/routes/produto/novo/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { productSchema } from '$lib/validation/productSchema';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(productSchema));

	// Busca os dados para preencher os <select> do formulário
	const brands = await query('SELECT id, nome FROM product_brand WHERE ativo = TRUE ORDER BY nome');
	const categories = await query(
		'SELECT id, nome FROM product_category WHERE ativo = TRUE ORDER BY nome'
	);
	const units = await query('SELECT id, nome, sigla FROM product_unit WHERE ativo = TRUE ORDER BY nome');
	const suppliers = await query('SELECT id, nome FROM supplier ORDER BY nome');

    console.log(suppliers)

	return { form, brands, categories, units, suppliers };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(productSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const {
			nome,
			descricao,
			codigo_barras,
			brand_id,
			category_id,
			unit_id,
			supplier_id,
			valor_compra,
			valor_venda,
			percentual_lucro,
			estoque,
			ativo
		} = form.data;

		try {
			await query(
				`INSERT INTO product (
                    nome, descricao, codigo_barras, brand_id, category_id, unit_id, supplier_id,
                    valor_compra, valor_venda, percentual_lucro, estoque, ativo
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					nome,
					descricao,
					codigo_barras,
					brand_id,
					category_id,
					unit_id,
					supplier_id,
					valor_compra,
					valor_venda,
					percentual_lucro,
					estoque,
					ativo
				]
			);
		} catch (error) {
			console.error('Erro ao inserir produto:', error);
			return fail(500, { form, message: 'Não foi possível criar o produto.' });
		}

		throw redirect(303, '/produto');
	}
};