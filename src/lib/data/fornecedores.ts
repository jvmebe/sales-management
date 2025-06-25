"use server";
import { query } from '@/lib/db';
import { Supplier } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchSuppliers(): Promise<Supplier[]> {
  noStore();
  try {
    return await query<Supplier>(`
        SELECT s.*, c.nome as cidade_nome 
        FROM supplier s
        LEFT JOIN city c ON s.cidade_id = c.id
        ORDER BY s.nome ASC`);
  } catch (error) {
    throw new Error('Failed to fetch suppliers.');
  }
}

export async function fetchSupplierById(id: number): Promise<Supplier | null> {
  noStore();
  try {
    const data = await query<Supplier>(`SELECT * FROM supplier WHERE id = ?`, [id]);
    return data[0] || null;
  } catch (error) {
    throw new Error('Failed to fetch supplier.');
  }
}
