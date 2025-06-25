"use server";
import { query } from "@/lib/db";
import { ProductUnitForm, ProductUnitSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

export async function createProductUnit(data: ProductUnitForm) {
  const result = ProductUnitSchema.safeParse(data);
  if (!result.success) return { success: false, message: "Erro de validação." };

  const { nome, sigla, ativo } = result.data;
  try {
    await query(`INSERT INTO product_unit (nome, sigla, ativo) VALUES (?, ?, ?)`, [nome, sigla, ativo]);
    revalidatePath("/unidades-medida");
    return { success: true, message: "Unidade de medida criada com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao criar unidade de medida." };
  }
}

export async function updateProductUnit(id: number, data: ProductUnitForm) {
    const result = ProductUnitSchema.safeParse(data);
    if (!result.success) return { success: false, message: "Erro de validação." };

    const { nome, sigla, ativo } = result.data;
    try {
        await query(`UPDATE product_unit SET nome = ?, sigla = ?, ativo = ? WHERE id = ?`, [nome, sigla, ativo, id]);
        revalidatePath("/unidades-medida");
        return { success: true, message: "Unidade de medida atualizada com sucesso!" };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao atualizar." };
    }
}

export async function deleteProductUnit(id: number) {
    try {
        // Adicionar verificação de dependência (produtos) no futuro
        await query(`DELETE FROM product_unit WHERE id = ?`, [id]);
        revalidatePath("/unidades-medida");
        return { success: true, message: "Unidade de medida excluída com sucesso." };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao excluir." };
    }
}
