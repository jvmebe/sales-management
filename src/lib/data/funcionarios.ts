"use server";
import { query } from '@/lib/db';
import { Employee } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchEmployees(): Promise<Employee[]> {
  noStore();
  try {
    return await query<Employee>(`
        SELECT e.*, c.nome as cidade_nome 
        FROM employee e
        LEFT JOIN city c ON e.cidade_id = c.id
        ORDER BY e.nome ASC`);
  } catch (error) {
    throw new Error('Failed to fetch employees.');
  }
}

export async function fetchEmployeeById(id: number): Promise<Employee | null> {
  noStore();
  try {
    const data = await query<Employee>(`SELECT * FROM employee WHERE id = ?`, [id]);
    return data[0] || null;
  } catch (error) {
    throw new Error('Failed to fetch employee.');
  }
}
