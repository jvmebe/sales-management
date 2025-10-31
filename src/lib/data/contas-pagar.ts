"use server";
import { query } from "@/lib/db";
import { PurchaseInstallment, ContasPagarStatus } from "@/lib/definitions";
import { unstable_noStore as noStore } from "next/cache";
import { RowDataPacket } from "mysql2";

/**
 * Busca TODAS as parcelas de contas (pagas, abertas, canceladas)
 * para filtragem no lado do cliente.
 */
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
    console.error("Database Error:", error);
    throw new Error("Failed to fetch contas a pagar.");
  }
}

/**
 * Busca uma parcela específica e os padrões financeiros
 * da sua condição de pagamento original.
 */
export async function fetchParcelaById(
  id: number,
): Promise<PurchaseInstallment | null> {
  noStore();
  try {
    const data = await query<RowDataPacket[]>(
      `
      SELECT
        pi.*,
        p.numero_nota,
        p.ativo as purchase_ativo,
        s.nome AS supplier_nome,
        pc.juros as default_juros_percent,
        pc.multa as default_multa,
        pc.desconto as default_desconto
      FROM purchase_installment pi
      JOIN purchase p ON pi.purchase_id = p.id
      JOIN supplier s ON p.supplier_id = s.id
      LEFT JOIN payment_condition pc ON p.payment_condition_id = pc.id
      WHERE
        pi.id = ?
    `,
      [id],
    );

    if (data.length === 0) return null;
    return data[0] as PurchaseInstallment;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch parcela.");
  }
}
