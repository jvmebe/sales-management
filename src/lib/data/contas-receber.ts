"use server";
import { query } from "@/lib/db";
import { SaleInstallmentDTO } from "@/lib/definitions";
import { unstable_noStore as noStore } from "next/cache";
import { RowDataPacket } from "mysql2";

export async function fetchAllContasReceber(): Promise<SaleInstallmentDTO[]> {
  noStore();
  try {
    const data = await query<SaleInstallmentDTO[]>(`
      SELECT
        si.*,
        s.id as sale_id_visual,
        s.ativo as sale_ativo,
        c.nome AS client_nome
      FROM sale_installment si
      JOIN sale s ON si.sale_id = s.id
      JOIN client c ON s.client_id = c.id
      ORDER BY
        si.data_vencimento ASC
    `);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch contas a receber.");
  }
}

export async function fetchParcelaReceberById(
  id: number,
): Promise<SaleInstallmentDTO | null> {
  noStore();
  try {
    const data = await query<RowDataPacket[]>(
      `
      SELECT
        si.*,
        s.id as sale_id_visual,
        s.ativo as sale_ativo,
        c.nome AS client_nome,
        pc.juros as default_juros_percent,
        pc.multa as default_multa,
        pc.desconto as default_desconto,
        -- Busca a forma de pagamento configurada no modelo da parcela (tabela payment_installment)
        pi_template.forma_pagamento_id as default_payment_method_id
      FROM sale_installment si
      JOIN sale s ON si.sale_id = s.id
      JOIN client c ON s.client_id = c.id
      LEFT JOIN payment_condition pc ON s.payment_condition_id = pc.id
      -- Faz o join para achar a configuração original da parcela (pelo ID da condição e número da parcela)
      LEFT JOIN payment_installment pi_template ON (
          pc.id = pi_template.condicao_id AND
          si.numero_parcela = pi_template.numero_parcela
      )
      WHERE
        si.id = ?
    `,
      [id],
    );

    if (data.length === 0) return null;
    return data[0] as SaleInstallmentDTO;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch parcela.");
  }
}
