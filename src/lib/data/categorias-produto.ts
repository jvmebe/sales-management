"use server";
import { query } from '@/lib/db';
import { ProductCategory } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  noStore();
  try {
    return await query<ProductCategory>(`SELECT * FROM product_category ORDER BY nome ASC`);
  } catch (error) {
    throw new Error('Failed to fetch product categories.');
  }
}

export async function fetchProductCategoryById(id: number): Promise<ProductCategory | null> {
  noStore();
  try {
    const data = await query<ProductCategory>(`SELECT * FROM product_category WHERE id = ?`, [id]);
    return data[0] || null;
  } catch (error) {
    throw new Error('Failed to fetch product category.');
  }
}
