"use server";

import pool from "@/lib/db";
import { SaleForm, SaleSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function createSale(data: SaleForm) {
  const result = SaleSchema.safeParse(data);

  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, message: firstError || "Erro de validação." };
  }

  const { items, installments, ...saleData } = result.data;
  const valorTotalCalculado = items.reduce((acc, item) => acc + (item.quantidade * item.valor_unitario), 0);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. GERAR NÚMERO DA NOTA (Increment)
    // Busca o maior número atual. Se não houver, começa em 0.
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT COALESCE(MAX(numero_nota), 0) as last_num FROM sale`
    );
    const nextNumeroNota = (rows[0].last_num || 0) + 1;

    // 2. Inserir Venda com o número gerado, modelo 55 e série 1
    const [saleResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO sale (client_id, employee_id, data_emissao, payment_condition_id, valor_total, ativo, modelo, serie, numero_nota)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        saleData.client_id,
        saleData.employee_id,
        saleData.data_emissao,
        saleData.payment_condition_id,
        valorTotalCalculado,
        true,
        '55',           // Modelo Fixo
        '1',            // Série Fixa
        nextNumeroNota  // Número Gerado
      ]
    );
    const saleId = saleResult.insertId;

    // 3. Processar Itens (Manteve-se igual)
    for (const item of items) {
      const [productRows] = await connection.execute<RowDataPacket[]>(
        `SELECT estoque, nome FROM product WHERE id = ? FOR UPDATE`,
        [item.product_id]
      );

      if (productRows.length === 0) throw new Error(`Produto ID ${item.product_id} não encontrado.`);
      const currentProduct = productRows[0];

      if (currentProduct.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto "${currentProduct.nome}". Disponível: ${currentProduct.estoque}.`);
      }

      await connection.execute(
        `INSERT INTO sale_item (sale_id, product_id, quantidade, valor_unitario) VALUES (?, ?, ?, ?)`,
        [saleId, item.product_id, item.quantidade, item.valor_unitario]
      );

      await connection.execute(
        `UPDATE product SET estoque = estoque - ? WHERE id = ?`,
        [item.quantidade, item.product_id]
      );
    }

    // 4. Inserir Parcelas (Manteve-se igual)
    if (installments.length > 0) {
        const totalParcelas = installments.reduce((acc, inst) => acc + inst.valor_parcela, 0);
        if (Math.abs(totalParcelas - valorTotalCalculado) > 0.05) {
             throw new Error(`Divergência de valores.`);
        }

        const installmentValuesPlaceholder = installments.map(() => '(?, ?, ?, ?)').join(', ');
        const installmentSql = `INSERT INTO sale_installment (sale_id, numero_parcela, data_vencimento, valor_parcela) VALUES ${installmentValuesPlaceholder}`;
        const installmentValues = installments.flatMap(inst => [saleId, inst.numero_parcela, inst.data_vencimento, inst.valor_parcela]);
        await connection.execute(installmentSql, installmentValues);
    }

    await connection.commit();
    revalidatePath("/produtos");
    revalidatePath("/vendas");

    return { success: true, message: `Venda Nº ${nextNumeroNota} realizada com sucesso!` };

  } catch (error: any) {
    await connection.rollback();
    console.error("Erro ao criar venda:", error);
    return { success: false, message: error.message || "Erro no banco ao processar a venda." };
  } finally {
    connection.release();
  }
}

export async function cancelSale(id: number) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Verifica se a venda existe e está ativa
    const [sales] = await connection.execute<RowDataPacket[]>(
      `SELECT ativo FROM sale WHERE id = ? FOR UPDATE`,
      [id]
    );
    if (sales.length === 0) throw new Error("Venda não encontrada.");
    if (!sales[0].ativo) throw new Error("Esta venda já está cancelada.");

    // 2. Verifica se existem parcelas já pagas (Bloqueio de Cancelamento)
    const [paidInstallments] = await connection.execute<RowDataPacket[]>(
      `SELECT id FROM sale_installment WHERE sale_id = ? AND data_pagamento IS NOT NULL LIMIT 1`,
      [id]
    );

    if (paidInstallments.length > 0) {
      throw new Error("Não é possível cancelar: Existem parcelas desta venda já recebidas no financeiro.");
    }

    // 3. Estorna o estoque
    const [items] = await connection.execute<RowDataPacket[]>(
      `SELECT product_id, quantidade FROM sale_item WHERE sale_id = ?`,
      [id]
    );
    for (const item of items) {
      await connection.execute(
        `UPDATE product SET estoque = estoque + ? WHERE id = ?`,
        [item.quantidade, item.product_id]
      );
    }

    // 4. Inativa a venda
    await connection.execute(`UPDATE sale SET ativo = FALSE WHERE id = ?`, [id]);

    await connection.commit();
    revalidatePath("/vendas");
    revalidatePath("/produtos");
    return { success: true, message: "Venda cancelada e estoque estornado com sucesso!" };

  } catch (error: any) {
    await connection.rollback();
    return { success: false, message: error.message || "Erro ao cancelar venda." };
  } finally {
    connection.release();
  }
}
