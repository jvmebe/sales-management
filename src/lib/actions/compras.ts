"use server";
import { query } from "@/lib/db";
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

    const itemValues = items.map(item => [purchaseId, item.product_id, item.quantidade, item.valor_unitario]);
    const itemSql = `INSERT INTO purchase_item (purchase_id, product_id, quantidade, valor_unitario) VALUES ?`;
    await query(itemSql, [itemValues]);

    const installmentValues = installments.map(inst => [purchaseId, inst.numero_parcela, inst.data_vencimento, inst.valor_parcela]);
    const installmentSql = `INSERT INTO purchase_installment (purchase_id, numero_parcela, data_vencimento, valor_parcela) VALUES ?`;
    await query(installmentSql, [installmentValues]);


    revalidatePath("/compras");
    return { success: true, message: "Compra cadastrada com sucesso!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro no banco: Falha ao criar compra." };
  }
}