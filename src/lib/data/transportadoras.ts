"use server";
import { query } from '@/lib/db';
import { Transportadora } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchTransportadoras(): Promise<Transportadora[]> {
  noStore();
  try {
    return await query<Transportadora>(`
        SELECT t.*, c.nome as cidade_nome 
        FROM transportadora t
        LEFT JOIN city c ON t.cidade_id = c.id
        ORDER BY t.nome ASC`);
  } catch (error) {
    throw new Error('Failed to fetch transportadoras.');
  }
}

export async function fetchTransportadoraById(id: number): Promise<Transportadora | null> {
  noStore();
  try {
    const data = await query<Transportadora>(`SELECT * FROM transportadora WHERE id = ?`, [id]);
    return data[0] || null;
  } catch (error) {
    throw new Error('Failed to fetch transportadora.');
  }
}
