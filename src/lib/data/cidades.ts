"use server";
import { query } from '@/lib/db';
import { City } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchCities(): Promise<City[]> {
  noStore();
  try {
    const data = await query<City>(
      `SELECT ci.*, s.nome as state_nome, s.sigla as state_sigla
       FROM city ci
       JOIN state s ON ci.state_id = s.id
       ORDER BY ci.nome ASC`
    );
    return data;
  } catch (error) {
    throw new Error('Failed to fetch cities.');
  }
}

export async function fetchCityById(id: number): Promise<City | null> {
  noStore();
  try {
    const data = await query<City>(`SELECT * FROM city WHERE id = ?`, [id]);
    return data[0] || null;
  } catch (error) {
    throw new Error('Failed to fetch city.');
  }
}