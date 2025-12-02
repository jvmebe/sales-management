"use server";
import { query } from "@/lib/db";
import { BaixaContaReceberForm, BaixaContaReceberSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function darBaixaContaReceber(data: BaixaContaReceberForm) {
  const result = BaixaContaReceberSchema.safeParse(data);
  if (!result.success) {
    const firstError = Object.values(
      result.error.flatten().fieldErrors,
    )[0]?.[0];
    return { success: false, message: firstError || "Erro de validação." };
  }

  const {
    id,
    data_pagamento,
    payment_method_id,
    valor_multa,
    valor_juros,
    valor_juros_calculado,
    valor_desconto,
    valor_pago_calculado,
    observacao,
  } = result.data;

  try {
    // 1. Identificar a parcela atual para saber qual venda ela pertence
    // CORREÇÃO: Removemos a desestruturação [ ] aqui para pegar o array inteiro
    const rows = await query<RowDataPacket[]>(
      `SELECT sale_id, numero_parcela FROM sale_installment WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
        return { success: false, message: "Parcela não encontrada." };
    }

    // Agora pegamos a primeira linha corretamente
    const { sale_id, numero_parcela } = rows[0];

    // 2. Verificar se existem parcelas anteriores em aberto
    const pendingInstallments = await query<RowDataPacket[]>(
      `SELECT id
       FROM sale_installment
       WHERE sale_id = ?
       AND numero_parcela < ?
       AND data_pagamento IS NULL
       LIMIT 1`,
      [sale_id, numero_parcela]
    );

    if (pendingInstallments.length > 0) {
        return {
            success: false,
            message: `Não é possível baixar a parcela ${numero_parcela}. A parcela ${numero_parcela - 1} (ou anterior) ainda está pendente.`
        };
    }

    // 3. Executar a Baixa
    const updateResult = await query<ResultSetHeader>(
      `UPDATE sale_installment
       SET
         data_pagamento = ?,
         payment_method_id = ?,
         valor_multa = ?,
         valor_juros = ?,
         valor_desconto = ?,
         valor_pago = ?,
         observacao = ?
       WHERE
         id = ? AND data_pagamento IS NULL`,
      [
        data_pagamento,
        payment_method_id,
        valor_multa,
        valor_juros_calculado,
        valor_desconto,
        valor_pago_calculado,
        observacao,
        id,
      ],
    );

    if (updateResult.affectedRows === 0) {
      return {
        success: false,
        message: "A parcela já foi recebida anteriormente.",
      };
    }

    revalidatePath("/contas-receber");
    return {
      success: true,
      message: "Recebimento registrado com sucesso!",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Erro no banco: Falha ao dar baixa na parcela.",
    };
  }
}
