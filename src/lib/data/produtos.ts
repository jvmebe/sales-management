"use server";
import { query } from '@/lib/db';
import { Product } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchProducts(): Promise<Product[]> {
  noStore();
  try {
    return await query<Product>(`
      SELECT
        p.*,
        b.nome as brand_nome,
        c.nome as category_nome,
        u.sigla as unit_sigla
      FROM product p
      LEFT JOIN product_brand b ON p.brand_id = b.id
      LEFT JOIN product_category c ON p.category_id = c.id
      JOIN product_unit u ON p.unit_id = u.id
      ORDER BY p.nome ASC
    `);
  } catch (error) {
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  noStore();
  try {
    const productData = await query<Product>(`SELECT * FROM product WHERE id = ?`, [id]);
    const product = productData[0];

    const suppliers = await query<any>(`
      SELECT s.id
      FROM supplier s
      JOIN product_supplier ps ON s.id = ps.supplier_id
      WHERE ps.product_id = ?
    `, [id]);

    product.supplier_ids = suppliers.map((s: any) => s.id);

    return product;
  } catch (error) {
    throw new Error('Failed to fetch product.');
  }
}