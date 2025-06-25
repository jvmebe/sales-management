"use server";
import { query } from '@/lib/db';
import { ProductBrand } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchProductBrands(): Promise<ProductBrand[]> {
  noStore();
  try {
    return await query<ProductBrand>(`SELECT * FROM product_brand ORDER BY nome ASC`);
  } catch (error) {
    throw new Error('Failed to fetch product brands.');
  }
}

export async function fetchProductBrandById(id: number): Promise<ProductBrand | null> {
  noStore();
  try {
    const data = await query<ProductBrand>(`SELECT * FROM product_brand WHERE id = ?`, [id]);
    return data[0] || null;
  } catch (error) {
    throw new Error('Failed to fetch product brand.');
  }
}
