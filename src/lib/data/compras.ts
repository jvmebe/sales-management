"use server";
import { query } from '@/lib/db';
import { Purchase } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchPurchases(): Promise<Purchase[]> {
  noStore();
  try {
    const data = await query<Purchase[]>(`
      SELECT
        p.*,
        s.nome as supplier_nome
      FROM purchase p
      JOIN supplier s ON p.supplier_id = s.id
      ORDER BY p.data_emissao DESC
    `);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch purchases.');
  }
}

export async function fetchPurchaseById(id: number): Promise<Purchase | null> {
    noStore();
    try {
      const purchaseData = await query<Purchase[]>(`
        SELECT p.*, s.nome as supplier_nome, pc.descricao as payment_condition_descricao
        FROM purchase p
        JOIN supplier s ON p.supplier_id = s.id
        LEFT JOIN payment_condition pc ON p.payment_condition_id = pc.id
        WHERE p.id = ?
      `, [id]);

      if (purchaseData.length === 0) return null;

      const purchase = purchaseData[0];

      const items = await query<any[]>(`
        SELECT pi.*, p.nome as product_nome
        FROM purchase_item pi
        JOIN product p ON pi.product_id = p.id
        WHERE pi.purchase_id = ?
      `, [id]);
      purchase.items = items;

      const installments = await query<any[]>(`SELECT * FROM purchase_installment WHERE purchase_id = ?`, [id]);
      purchase.installments = installments;

      return purchase;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch purchase.');
    }
  }