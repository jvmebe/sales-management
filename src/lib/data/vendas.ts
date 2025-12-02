"use server";
import { query } from '@/lib/db';
import { SaleForm } from '@/lib/definitions'; // Vamos reutilizar o tipo do form ou criar um específico se precisar
import { unstable_noStore as noStore } from 'next/cache';

export type SaleListDTO = {
  id: number;
  client_nome: string;
  employee_nome: string;
  data_emissao: string;
  valor_total: number;
  ativo: boolean;
};

export async function fetchSales(): Promise<SaleListDTO[]> {
  noStore();
  try {
    return await query<SaleListDTO[]>(`
      SELECT
        s.id,
        s.data_emissao,
        s.valor_total,
        s.ativo,
        c.nome as client_nome,
        e.nome as employee_nome
      FROM sale s
      JOIN client c ON s.client_id = c.id
      JOIN employee e ON s.employee_id = e.id
      ORDER BY s.data_emissao DESC, s.id DESC
    `);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error('Failed to fetch sales.');
  }
}

export async function fetchSaleById(id: number): Promise<SaleForm & { ativo: boolean } | null> {
  noStore();
  try {
    // 1. Busca dados principais
    const sales = await query<any[]>(`SELECT * FROM sale WHERE id = ?`, [id]);
    if (sales.length === 0) return null;
    const sale = sales[0];

    // 2. Busca itens
    const items = await query<any[]>(`
      SELECT product_id, quantidade, valor_unitario
      FROM sale_item
      WHERE sale_id = ?
    `, [id]);

    // 3. Busca parcelas
    const installments = await query<any[]>(`
      SELECT numero_parcela, data_vencimento, valor_parcela
      FROM sale_installment
      WHERE sale_id = ?
      ORDER BY numero_parcela ASC
    `, [id]);

    return {
      id: sale.id,
      client_id: sale.client_id,
      employee_id: sale.employee_id,
      payment_condition_id: sale.payment_condition_id,
      data_emissao: sale.data_emissao,
      ativo: Boolean(sale.ativo), // Importante para saber se pode cancelar
      items: items.map(i => ({
        ...i,
        valor_unitario: Number(i.valor_unitario)
      })),
      installments: installments.map(i => ({
        ...i,
        data_vencimento: i.data_vencimento, // O driver mysql2 já retorna Date normalmente
        valor_parcela: Number(i.valor_parcela)
      }))
    };

  } catch (error) {
    console.error("Database Error:", error);
    throw new Error('Failed to fetch sale details.');
  }
}
