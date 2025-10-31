"use server";
import { query } from "@/lib/db";
import { BaixaParcelaForm, BaixaParcelaSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { ResultSetHeader } from "mysql2";

export async function darBaixaParcela(data: BaixaParcelaForm) {
  const result = BaixaParcelaSchema.safeParse(data);
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
    const result = await query<ResultSetHeader>(
      `UPDATE purchase_installment
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

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "A parcela não foi encontrada ou já foi paga.",
      };
    }

    revalidatePath("/contas-pagar");
    return {
      success: true,
      message: "Baixa da parcela realizada com sucesso!",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Erro no banco: Falha ao dar baixa na parcela.",
    };
  }
}
