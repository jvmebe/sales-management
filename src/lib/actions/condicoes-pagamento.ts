"use server";

import pool from "@/lib/db"; // Importa o pool para usar transações
import { PaymentConditionForm, PaymentConditionSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

export async function createPaymentCondition(data: PaymentConditionForm) {
  const result = PaymentConditionSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: result.error.flatten().fieldErrors.parcelas?.[0] || "Erro de validação." };
  }

  const { descricao, juros, multa, desconto, ativo, parcelas } = result.data;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [conditionResult] = await connection.execute(
      'INSERT INTO payment_condition (descricao, juros, multa, desconto, ativo) VALUES (?, ?, ?, ?, ?)',
      [descricao, juros, multa, desconto, ativo]
    );
    const conditionId = (conditionResult as any).insertId;

    for (const parcela of parcelas) {
      await connection.execute(
        'INSERT INTO payment_installment (condicao_id, numero_parcela, dias_vencimento, percentual_valor, forma_pagamento_id) VALUES (?, ?, ?, ?, ?)',
        [conditionId, parcela.numero_parcela, parcela.dias_vencimento, parcela.percentual_valor, parcela.forma_pagamento_id]
      );
    }

    await connection.commit();
    revalidatePath("/condicoes-pagamento");
    return { success: true, message: "Condição de pagamento criada com sucesso!" };
  } catch (error) {
    await connection.rollback();
    return { success: false, message: "Erro no banco: Falha ao criar condição." };
  } finally {
    connection.release();
  }
}

export async function updatePaymentCondition(id: number, data: PaymentConditionForm) {
  const result = PaymentConditionSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: result.error.flatten().fieldErrors.parcelas?.[0] || "Erro de validação." };
  }
  
  const { descricao, juros, multa, desconto, ativo, parcelas } = result.data;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Atualiza a tabela principal
    await connection.execute(
        'UPDATE payment_condition SET descricao = ?, juros = ?, multa = ?, desconto = ?, ativo = ? WHERE id = ?',
        [descricao, juros, multa, desconto, ativo, id]
    );

    // Deleta as parcelas antigas
    await connection.execute('DELETE FROM payment_installment WHERE condicao_id = ?', [id]);

    // Insere as novas parcelas
    for (const parcela of parcelas) {
        await connection.execute(
            'INSERT INTO payment_installment (condicao_id, numero_parcela, dias_vencimento, percentual_valor, forma_pagamento_id) VALUES (?, ?, ?, ?, ?)',
            [id, parcela.numero_parcela, parcela.dias_vencimento, parcela.percentual_valor, parcela.forma_pagamento_id]
        );
    }
    
    await connection.commit();
    revalidatePath("/condicoes-pagamento");
    return { success: true, message: "Condição atualizada com sucesso!" };
  } catch (error) {
    await connection.rollback();
    return { success: false, message: "Erro no banco: Falha ao atualizar condição." };
  } finally {
    connection.release();
  }
}
