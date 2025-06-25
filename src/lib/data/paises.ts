import { query } from '@/lib/db';
import { Country } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';


export async function fetchCountries(): Promise<Country[]> {
  noStore();

  try {
    const data = await query<Country>(
      `SELECT id, nome, sigla, ativo, data_criacao, data_modificacao
       FROM country
       ORDER BY nome ASC`
    );
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch countries.');
  }
}

export async function fetchActiveCountries() {
  noStore();
  try {
    const data = await query<Country>(
      `SELECT id, nome FROM country WHERE ativo = TRUE ORDER BY nome ASC`
    );
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch active countries.');
  }
}

export async function fetchCountryById(id: number): Promise<Country | null> {
  noStore();
  try {
    const data = await query<Country>(`SELECT * FROM country WHERE id = ?`, [id]);
    return data[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch country.');
  }
}