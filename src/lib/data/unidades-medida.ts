"use server";
import { query } from '@/lib/db';
import { ProductUnit } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchProductUnits(): Promise<ProductUnit[]> {
  noStore();
  try {
    return await query<ProductUnit>(`SELECT * FROM product_unit ORDER BY nome ASC`);
  } catch (error) {
    throw new Error('Failed to fetch product units.');
  }
}

export async function fetchProductUnitById(id: number): Promise<ProductUnit | null> {
  noStore();
  try {
    const data = await query<ProductUnit>(`SELECT * FROM product_unit WHERE id = ?`, [id]);
    return data[0] || null;
  } catch (error) {
    throw new Error('Failed to fetch product unit.');
  }
}
