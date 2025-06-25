import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
	const categories = await query('SELECT id, nome, descricao, ativo FROM product_category ORDER BY nome');
	return { categories };
};