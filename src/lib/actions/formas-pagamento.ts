"use server";
import { query } from "@/lib/db";
import { PaymentMethodForm, PaymentMethodSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

export async function createPaymentMethod(data: PaymentMethodForm) {
  const result = PaymentMethodSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Erro de validação." };
  }
  const { descricao, ativo } = result.data;
  try {
    await query(
      `INSERT INTO payment_method (descricao, ativo) VALUES (?, ?)`,
      [descricao, ativo]
    );
    revalidatePath("/formas-pagamento");
    return { success: true, message: "Forma de pagamento criada com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao criar forma de pagamento." };
  }
}

export async function updatePaymentMethod(id: number, data: PaymentMethodForm) {
    const result = PaymentMethodSchema.safeParse(data);
    if (!result.success) {
        return { success: false, message: "Erro de validação." };
    }
    const { descricao, ativo } = result.data;
    try {
        await query(
            `UPDATE payment_method SET descricao = ?, ativo = ? WHERE id = ?`,
            [descricao, ativo, id]
        );
        revalidatePath("/formas-pagamento");
        return { success: true, message: "Forma de pagamento atualizada com sucesso!" };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao atualizar." };
    }
}

export async function deletePaymentMethod(id: number) {
    try {
        await query(`DELETE FROM payment_method WHERE id = ?`, [id]);
        revalidatePath("/formas-pagamento");
        return { success: true, message: "Forma de pagamento excluída com sucesso." };
    } catch (error) {
        return { success: false, message: "Esta forma de pagamento está em uso por um ou mais condições!" };
    }
}
