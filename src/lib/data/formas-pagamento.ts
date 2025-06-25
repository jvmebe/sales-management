"use server";
import { query } from '@/lib/db';
import { PaymentMethod } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  noStore();
  try {
    const data = await query<PaymentMethod>(
      `SELECT * FROM payment_method ORDER BY descricao ASC`
    );
    return data;
  } catch (error) {
    throw new Error('Failed to fetch payment methods.');
  }
}

export async function fetchPaymentMethodById(id: number): Promise<PaymentMethod | null> {
  noStore();
  try {
    const data = await query<PaymentMethod>(`SELECT * FROM payment_method WHERE id = ?`, [id]);
    return data[0] || null;
  } catch (error) {
    throw new Error('Failed to fetch payment method.');
  }
}

export async function fetchActivePaymentMethods(): Promise<PaymentMethod[]> {
    noStore();
    try {
        const data = await query<PaymentMethod>(`SELECT id, descricao FROM payment_method WHERE ativo = TRUE ORDER BY descricao ASC`);
        return data;
    } catch (error) {
        throw new Error('Failed to fetch active payment methods.');
    }
}
