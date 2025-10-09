"use server";
import pool, { query } from "@/lib/db";
import { PurchaseForm, PurchaseSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { ResultSetHeader } from "mysql2";

export async function createPurchase(data: PurchaseForm) {
  const result = PurchaseSchema.safeParse(data);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, message: firstError || "Erro de validação." };
  }

  const { items, installments, ...purchaseData } = result.data;

  try {
    const purchaseResult = await query<ResultSetHeader>(
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

    // Inserção de Itens da Compra (CORRIGIDO)
    if (items.length > 0) {
      const itemValuesPlaceholder = items.map(() => '(?, ?, ?, ?)').join(', ');
      const itemSql = `INSERT INTO purchase_item (purchase_id, product_id, quantidade, valor_unitario) VALUES ${itemValuesPlaceholder}`;
      const itemValues = items.flatMap(item => [purchaseId, item.product_id, item.quantidade, item.valor_unitario]);
      await query(itemSql, itemValues);
    }

    if (installments.length > 0) {
        const installmentValuesPlaceholder = installments.map(() => '(?, ?, ?, ?)').join(', ');
        const installmentSql = `INSERT INTO purchase_installment (purchase_id, numero_parcela, data_vencimento, valor_parcela) VALUES ${installmentValuesPlaceholder}`;
        const installmentValues = installments.flatMap(inst => [purchaseId, inst.numero_parcela, inst.data_vencimento, inst.valor_parcela]);
        await query(installmentSql, installmentValues);
    }


    revalidatePath("/compras");
    return { success: true, message: "Compra cadastrada com sucesso!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro no banco: Falha ao criar compra." };
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

    // atualiza a compra
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

    // deleta os itens e parcelas velhos
    await connection.execute(`DELETE FROM purchase_item WHERE purchase_id = ?`, [id]);
    await connection.execute(`DELETE FROM purchase_installment WHERE purchase_id = ?`, [id]);

    // insere os novos itens
    if (items.length > 0) {
      const itemValuesPlaceholder = items.map(() => '(?, ?, ?, ?)').join(', ');
      const itemSql = `INSERT INTO purchase_item (purchase_id, product_id, quantidade, valor_unitario) VALUES ${itemValuesPlaceholder}`;
      const itemValues = items.flatMap(item => [id, item.product_id, item.quantidade, item.valor_unitario]);
      await connection.execute(itemSql, itemValues);
    }

    // insere as novas parcelas
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

        await connection.execute(
            `UPDATE purchase SET ativo = false, motivo_cancelamento = ? WHERE id = ? AND ativo = true`,
            [reason, id]
        );

        // busca os itens da compra
        const [items] = await connection.execute(
            `SELECT product_id, quantidade FROM purchase_item WHERE purchase_id = ?`, [id]
        );

        // reverte o estoque
        for (const item of (items as any[])) {
            await connection.execute(
                `UPDATE product SET estoque = estoque - ? WHERE id = ?`,
                [item.quantidade, item.product_id]
            );
        }

        await connection.commit();
        revalidatePath("/compras");
        return { success: true, message: "Compra cancelada com sucesso!" };
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return { success: false, message: "Erro no banco: Falha ao cancelar a compra." };
    } finally {
        connection.release();
    }
}