import type { PageServerLoad } from './$types';
import { query } from '$lib/db';

export const load: PageServerLoad = async () => {
	const products = await query(`
        SELECT 
            p.id, 
            p.nome, 
            p.valor_venda, 
            p.estoque, 
            p.ativo,
            b.nome AS brand_name,
            c.nome AS category_name
        FROM product p
        LEFT JOIN product_brand b ON p.brand_id = b.id
        LEFT JOIN product_category c ON p.category_id = c.id
        ORDER BY p.nome
    `);
	return { products };
};