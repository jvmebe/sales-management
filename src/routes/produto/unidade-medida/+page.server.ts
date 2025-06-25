import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
	const units = await query('SELECT id, nome, sigla, ativo FROM product_unit ORDER BY nome');
	return { units };
};