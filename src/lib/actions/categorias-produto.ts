"use server";
import { query } from "@/lib/db";
import { ProductCategoryForm, ProductCategorySchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

export async function createProductCategory(data: ProductCategoryForm) {
  const result = ProductCategorySchema.safeParse(data);
  if (!result.success) return { success: false, message: "Erro de validação." };

  const { nome, descricao, ativo } = result.data;
  try {
    await query(`INSERT INTO product_category (nome, descricao, ativo) VALUES (?, ?, ?)`, [nome, descricao, ativo]);
    revalidatePath("/categorias-produto");
    return { success: true, message: "Categoria criada com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao criar categoria." };
  }
}

export async function updateProductCategory(id: number, data: ProductCategoryForm) {
    const result = ProductCategorySchema.safeParse(data);
    if (!result.success) return { success: false, message: "Erro de validação." };

    const { nome, descricao, ativo } = result.data;
    try {
        await query(`UPDATE product_category SET nome = ?, descricao = ?, ativo = ? WHERE id = ?`, [nome, descricao, ativo, id]);
        revalidatePath("/categorias-produto");
        return { success: true, message: "Categoria atualizada com sucesso!" };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao atualizar." };
    }
}

export async function deleteProductCategory(id: number) {
    try {
        await query(`DELETE FROM product_category WHERE id = ?`, [id]);
        revalidatePath("/categorias-produto");
        return { success: true, message: "Categoria excluída com sucesso." };
    } catch (error) {
        return { success: false, message: "Existem produtos associados a esta categoria!" };
    }
}
