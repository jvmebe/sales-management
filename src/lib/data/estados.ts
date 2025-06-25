"use server";
import { query } from '@/lib/db';
import { State } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

/**
 * Busca todos os estados, incluindo o nome do país associado.
 */
export async function fetchStates(): Promise<State[]> {
  noStore();
  try {
    const data = await query<State>(
      `SELECT s.*, c.nome as country_nome
       FROM state s
       JOIN country c ON s.country_id = c.id
       ORDER BY s.nome ASC`
    );
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch states.');
  }
}

/**
 * Busca todos os estados ATIVOS para usar em dropdowns/seletores.
 */
export async function fetchActiveStates(): Promise<State[]> {
    noStore();
    try {
        const data = await query<State>(
            `SELECT s.id, s.nome, s.sigla FROM state s WHERE s.ativo = TRUE ORDER BY s.nome ASC`
        );
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch active states.');
    }
}


/**
 * Busca um estado específico pelo seu ID.
 */
export async function fetchStateById(id: number): Promise<State | null> {
  noStore();
  try {
    const data = await query<State>(`SELECT * FROM state WHERE id = ?`, [id]);
    return data[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch state.');
  }
}