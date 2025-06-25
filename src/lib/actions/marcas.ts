"use server";
import { query } from "@/lib/db";
import { ProductBrandForm, ProductBrandSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

export async function createProductBrand(data: ProductBrandForm) {
  const result = ProductBrandSchema.safeParse(data);
  if (!result.success) return { success: false, message: "Erro de validação." };

  const { nome, ativo } = result.data;
  try {
    await query(`INSERT INTO product_brand (nome, ativo) VALUES (?, ?)`, [nome, ativo]);
    revalidatePath("/marcas");
    return { success: true, message: "Marca criada com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao criar marca." };
  }
}

export async function updateProductBrand(id: number, data: ProductBrandForm) {
    const result = ProductBrandSchema.safeParse(data);
    if (!result.success) return { success: false, message: "Erro de validação." };

    const { nome, ativo } = result.data;
    try {
        await query(`UPDATE product_brand SET nome = ?, ativo = ? WHERE id = ?`, [nome, ativo, id]);
        revalidatePath("/marcas");
        return { success: true, message: "Marca atualizada com sucesso!" };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao atualizar marca." };
    }
}

export async function deleteProductBrand(id: number) {
    try {
        // Adicionar verificação de dependência (produtos) no futuro
        await query(`DELETE FROM product_brand WHERE id = ?`, [id]);
        revalidatePath("/marcas");
        return { success: true, message: "Marca excluída com sucesso." };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao excluir marca." };
    }
}
