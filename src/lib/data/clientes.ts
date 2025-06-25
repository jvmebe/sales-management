"use server";
import { query } from '@/lib/db';
import { Client } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchClients(): Promise<Client[]> {
  noStore();
  try {
    return await query<Client>(`
        SELECT 
            cl.*, 
            ci.nome as cidade_nome,
            pc.descricao as cond_pag_descricao
        FROM client cl
        LEFT JOIN city ci ON cl.cidade_id = ci.id
        LEFT JOIN payment_condition pc ON cl.cond_pag_id = pc.id
        ORDER BY cl.nome ASC`);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch clients.');
  }
}

export async function fetchClientById(id: number): Promise<Client | null> {
  noStore();
  try {
    const data = await query<Client>(`SELECT * FROM client WHERE id = ?`, [id]);
    return data[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch client.');
  }
}
