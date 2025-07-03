"use server";

import pool from "@/lib/db";
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

export async function deletePaymentCondition(id: number) {
  const connection = await pool.getConnection();
  try {
    // Verifica se algum cliente esta usando a condicao. Adicionar vendas e outras categorias dependentes no futuro
    const [clients] = await connection.execute(
      'SELECT id FROM client WHERE cond_pag_id = ? LIMIT 1',
      [id]
    );

    if (Array.isArray(clients) && clients.length > 0) {
      return {
        success: false,
        message: "Esta condição está em uso por um ou mais clientes!",
      };
    }

    await connection.beginTransaction();
    await connection.execute('DELETE FROM payment_condition WHERE id = ?', [id]);
    await connection.commit();

    revalidatePath("/condicoes-pagamento");
    return { success: true, message: "Condição de pagamento excluída com sucesso!" };

  } catch (error) {
    await connection.rollback();
    return { success: false, message: "Esta condição está em uso por um ou mais clientes!" };
  } finally {
    connection.release();
  }
}