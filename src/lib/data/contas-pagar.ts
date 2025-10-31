"use server";
import { query } from '@/lib/db';
import { PurchaseInstallment } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchAllContas(): Promise<PurchaseInstallment[]> {
  noStore();
  try {
    const data = await query<PurchaseInstallment[]>(`
      SELECT
        pi.*,
        p.numero_nota,
        p.ativo as purchase_ativo,
        s.nome AS supplier_nome
      FROM purchase_installment pi
      JOIN purchase p ON pi.purchase_id = p.id
      JOIN supplier s ON p.supplier_id = s.id
      ORDER BY
        pi.data_vencimento ASC
    `);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch contas a pagar.');
  }
}
