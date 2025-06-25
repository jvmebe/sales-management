import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
	const brands = await query('SELECT id, nome, ativo FROM product_brand ORDER BY nome');
	return { brands };
};