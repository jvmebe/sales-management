"use server";
import { query } from "@/lib/db";
import { ProductForm, ProductSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

// Uma constante para evitar repetição dos nomes dos campos na query
const PRODUCT_FIELDS = `nome, descricao, codigo_barras, valor_compra, valor_venda, estoque, brand_id, category_id, unit_id, supplier_id, ativo`;

export async function createProduct(data: ProductForm) {
  const result = ProductSchema.safeParse(data);
  if (!result.success) {
    // Retorna a primeira mensagem de erro para simplificar
    const firstError = result.error.flatten().fieldErrors;
    const errorMessage = Object.values(firstError)[0]?.[0] || "Erro de validação.";
    return { success: false, message: errorMessage };
  }
  
  const { ...fields } = result.data;
  try {
    await query(`INSERT INTO product (${PRODUCT_FIELDS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [
        fields.nome, 
        fields.descricao, 
        fields.codigo_barras, 
        fields.valor_compra, 
        fields.valor_venda, 
        fields.estoque, 
        fields.brand_id, 
        fields.category_id, 
        fields.unit_id, 
        fields.supplier_id, 
        fields.ativo
      ]
    );
    revalidatePath("/produtos");
    return { success: true, message: "Produto criado com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao criar produto." };
  }
}

export async function updateProduct(id: number, data: ProductForm) {
    const result = ProductSchema.safeParse(data);
    if (!result.success) {
      const firstError = result.error.flatten().fieldErrors;
      const errorMessage = Object.values(firstError)[0]?.[0] || "Erro de validação.";
      return { success: false, message: errorMessage };
    }

    const { ...fields } = result.data;
    try {
        await query(`
            UPDATE product SET nome = ?, descricao = ?, codigo_barras = ?, valor_compra = ?, valor_venda = ?, estoque = ?, brand_id = ?, category_id = ?, unit_id = ?, supplier_id = ?, ativo = ? 
            WHERE id = ?`, 
            [
              fields.nome, 
              fields.descricao, 
              fields.codigo_barras, 
              fields.valor_compra, 
              fields.valor_venda, 
              fields.estoque, 
              fields.brand_id, 
              fields.category_id, 
              fields.unit_id, 
              fields.supplier_id, 
              fields.ativo, 
              id
            ]
        );
        revalidatePath("/produtos");
        return { success: true, message: "Produto atualizado com sucesso!" };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao atualizar produto." };
    }
}

export async function deleteProduct(id: number) {
    try {
        await query(`DELETE FROM product WHERE id = ?`, [id]);
        revalidatePath("/produtos");
        return { success: true, message: "Produto excluído com sucesso." };
    } catch (error) {
        return { success: false, message: "Existem cadastros associados a este produto!" };
    }
}
