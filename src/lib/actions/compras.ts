"use server";
import pool, { query } from "@/lib/db";
import { PurchaseForm, PurchaseSchema, Product } from "@/lib/definitions"; // Importe o tipo Product
import { revalidatePath } from "next/cache";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function createPurchase(data: PurchaseForm) {
  const result = PurchaseSchema.safeParse(data);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, message: firstError || "Erro de validação." };
  }

  const { items, installments, ...purchaseData } = result.data;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Inserir a compra principal
    const [purchaseResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO purchase (modelo, serie, numero_nota, supplier_id, data_emissao, data_entrega, valor_frete, seguro, despesas, payment_condition_id, ativo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        purchaseData.modelo,
        purchaseData.serie,
        purchaseData.numero_nota,
        purchaseData.supplier_id,
        purchaseData.data_emissao,
        purchaseData.data_entrega,
        purchaseData.valor_frete,
        purchaseData.seguro,
        purchaseData.despesas,
        purchaseData.payment_condition_id,
        purchaseData.ativo,
      ]
    );
    const purchaseId = purchaseResult.insertId;

    // 2. Calcular o custo total e a quantidade total para o rateio
    const totalItensValue = items.reduce((sum, item) => sum + (item.quantidade * item.valor_unitario), 0);
    const totalCosts = purchaseData.valor_frete + purchaseData.seguro + purchaseData.despesas;

    // 3. Processar cada item da compra
    for (const item of items) {
      // Buscar estado atual do produto
      const [productRows] = await connection.execute<RowDataPacket[]>(
        `SELECT valor_compra, estoque FROM product WHERE id = ? FOR UPDATE`,
        [item.product_id]
      );

      if (productRows.length === 0) {
        throw new Error(`Produto com ID ${item.product_id} não encontrado.`);
      }
      const currentProduct = productRows[0] as { valor_compra: number, estoque: number };
      const old_valor_compra = currentProduct.valor_compra;
      const old_estoque = currentProduct.estoque;

      // Inserir o item da compra com os valores antigos
      await connection.execute(
          `INSERT INTO purchase_item (purchase_id, product_id, quantidade, valor_unitario, valor_compra_anterior, estoque_anterior) VALUES (?, ?, ?, ?, ?, ?)`,
          [purchaseId, item.product_id, item.quantidade, item.valor_unitario, old_valor_compra, old_estoque]
      );

      // Calcular o custo rateado para este item
      const itemTotalValue = item.quantidade * item.valor_unitario;
      const costRatio = totalItensValue > 0 ? itemTotalValue / totalItensValue : 0;
      const apportionedCost = totalCosts * costRatio;

      // Calcular novo custo médio ponderado
      const newTotalValue = (old_estoque * old_valor_compra) + itemTotalValue + apportionedCost;
      const newStock = old_estoque + item.quantidade;
      const newAverageCost = newStock > 0 ? newTotalValue / newStock : 0;

      // Atualizar o produto com novo estoque e novo custo de compra
      await connection.execute(
        `UPDATE product SET estoque = ?, valor_compra = ? WHERE id = ?`,
        [newStock, newAverageCost, item.product_id]
      );
    }

    // 4. Inserir as parcelas da compra
    if (installments.length > 0) {
        const installmentValuesPlaceholder = installments.map(() => '(?, ?, ?, ?)').join(', ');
        const installmentSql = `INSERT INTO purchase_installment (purchase_id, numero_parcela, data_vencimento, valor_parcela) VALUES ${installmentValuesPlaceholder}`;
        const installmentValues = installments.flatMap(inst => [purchaseId, inst.numero_parcela, inst.data_vencimento, inst.valor_parcela]);
        await connection.execute(installmentSql, installmentValues);
    }

    await connection.commit();
    revalidatePath("/produtos");
    revalidatePath("/compras");
    return { success: true, message: "Compra cadastrada com sucesso!" };
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return { success: false, message: "Erro no banco: Falha ao criar compra." };
  } finally {
    connection.release();
  }
}


export async function updatePurchase(id: number, data: PurchaseForm) {
  const result = PurchaseSchema.safeParse(data);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, message: firstError || "Erro de validação." };
  }

  const { items, installments, ...purchaseData } = result.data;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Atualiza a tabela principal de compra
    await connection.execute(
      `UPDATE purchase SET modelo = ?, serie = ?, numero_nota = ?, supplier_id = ?, data_emissao = ?, data_entrega = ?, valor_frete = ?, seguro = ?, despesas = ?, payment_condition_id = ?, ativo = ? WHERE id = ?`,
      [
        purchaseData.modelo,
        purchaseData.serie,
        purchaseData.numero_nota,
        purchaseData.supplier_id,
        purchaseData.data_emissao,
        purchaseData.data_entrega,
        purchaseData.valor_frete,
        purchaseData.seguro,
        purchaseData.despesas,
        purchaseData.payment_condition_id,
        purchaseData.ativo,
        id
      ]
    );

    // 2. Deleta itens e parcelas antigos
    await connection.execute(`DELETE FROM purchase_item WHERE purchase_id = ?`, [id]);
    await connection.execute(`DELETE FROM purchase_installment WHERE purchase_id = ?`, [id]);

    // 3. Insere os novos itens
    if (items.length > 0) {
      const itemValuesPlaceholder = items.map(() => '(?, ?, ?, ?)').join(', ');
      const itemSql = `INSERT INTO purchase_item (purchase_id, product_id, quantidade, valor_unitario) VALUES ${itemValuesPlaceholder}`;
      const itemValues = items.flatMap(item => [id, item.product_id, item.quantidade, item.valor_unitario]);
      await connection.execute(itemSql, itemValues);
    }

    // 4. Insere as novas parcelas
    if (installments.length > 0) {
        const installmentValuesPlaceholder = installments.map(() => '(?, ?, ?, ?)').join(', ');
        const installmentSql = `INSERT INTO purchase_installment (purchase_id, numero_parcela, data_vencimento, valor_parcela) VALUES ${installmentValuesPlaceholder}`;
        const installmentValues = installments.flatMap(inst => [id, inst.numero_parcela, inst.data_vencimento, inst.valor_parcela]);
        await connection.execute(installmentSql, installmentValues);
    }

    await connection.commit();
    revalidatePath("/compras");
    return { success: true, message: "Compra atualizada com sucesso!" };
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return { success: false, message: "Erro no banco: Falha ao atualizar a compra." };
  } finally {
    connection.release();
  }
}



export async function cancelPurchase(id: number, reason: string) {
    if (!reason || reason.trim().length < 5) {
        return { success: false, message: "O motivo do cancelamento deve ter pelo menos 5 caracteres." };
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Busca os itens da compra para reverter o estoque e o custo
        const [items] = await connection.execute<RowDataPacket[]>(
            `SELECT product_id, quantidade, valor_compra_anterior, estoque_anterior FROM purchase_item WHERE purchase_id = ?`, [id]
        );

        if (items.length === 0) {
            throw new Error("Itens da compra não encontrados para cancelamento.");
        }

        // 2. Reverte o estoque e o valor de compra para cada item
        for (const item of items) {
            await connection.execute(
                `UPDATE product SET estoque = ?, valor_compra = ? WHERE id = ?`,
                [item.estoque_anterior, item.valor_compra_anterior, item.product_id]
            );
        }

        // 3. Atualiza o status da compra e adiciona o motivo do cancelamento
        const [updateResult] = await connection.execute<ResultSetHeader>(
            `UPDATE purchase SET ativo = false, motivo_cancelamento = ? WHERE id = ? AND ativo = true`,
            [reason, id]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error("A compra já foi cancelada ou não foi encontrada.");
        }

        await connection.commit();
        revalidatePath("/produtos");
        revalidatePath("/compras");
        return { success: true, message: "Compra cancelada com sucesso!" };
    } catch (error: any) {
        await connection.rollback();
        console.error(error);
        return { success: false, message: error.message || "Erro no banco: Falha ao cancelar a compra." };
    } finally {
        connection.release();
    }
}
