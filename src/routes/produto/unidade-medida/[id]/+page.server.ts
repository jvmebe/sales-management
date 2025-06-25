import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from 'sveltekit-superforms';
import { productUnitSchema } from '$lib/validation/productUnitSchema';

export const load: PageServerLoad = async ({ params }) => {
	const unitId = parseInt(params.id, 10);
	if (isNaN(unitId)) {
		throw error(400, 'ID da unidade inválido');
	}

	const results: any[] = await query('SELECT * FROM product_unit WHERE id = ?', [unitId]);
	const unit = results[0];

	if (!unit) {
		throw error(404, 'Unidade de medida não encontrada');
	}

	const form = await superValidate(unit, zod(productUnitSchema));
	return { form, unit };
};

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, zod(productUnitSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await query(
				`UPDATE product_unit SET 
                    nome = ?,
                    sigla = ?, 
                    ativo = ?, 
                    data_ultima_edicao = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
				[form.data.nome, form.data.sigla, form.data.ativo, event.params.id]
			);
		} catch (e) {
			console.error(e);
			return fail(500, { form, message: 'Não foi possível atualizar a unidade.' });
		}
		throw redirect(303, '/produto/unidade-medida');
	},

	delete: async ({ params }) => {
		try {
			await query('DELETE FROM product_unit WHERE id = ?', [params.id]);
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'Não foi possível deletar a unidade.' });
		}
		throw redirect(303, '/produto/unidade-medida');
	}
};