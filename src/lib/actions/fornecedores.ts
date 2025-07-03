"use server";
import { query } from "@/lib/db";
import { SupplierForm, SupplierSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { format } from 'date-fns';

export async function createSupplier(data: SupplierForm) {
  const result = SupplierSchema.safeParse(data);
  if (!result.success) return { success: false, message: "Erro de validação." };

  const { is_juridica, nome, apelido, cpf, rg, data_nascimento, email, telefone, endereco, numero, complemento, bairro, cep, cidade_id, ativo } = result.data;
  try {
    await query(`
      INSERT INTO supplier (is_juridica, nome, apelido, cpf, rg, data_nascimento, email, telefone, endereco, numero, complemento, bairro, cep, cidade_id, ativo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [is_juridica, nome, apelido, cpf, rg, data_nascimento, email, telefone, endereco, numero, complemento, bairro, cep, cidade_id, ativo]
    );
    revalidatePath("/fornecedores");
    return { success: true, message: "Fornecedor criado com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao criar fornecedor." };
  }
}

export async function updateSupplier(id: number, data: SupplierForm) {
    const result = SupplierSchema.safeParse(data);
    if (!result.success) return { success: false, message: "Erro de validação." };
    console.log(result);
    const { is_juridica, nome, apelido, cpf, rg, data_nascimento, email, telefone, endereco, numero, complemento, bairro, cep, cidade_id, ativo } = result.data;
    const dataFormatada = data_nascimento ? format(data_nascimento, 'yyyy-MM-dd') : null;
    try {
        await query(`
            UPDATE supplier SET is_juridica = ?, nome = ?, apelido = ?, cpf = ?, rg = ?, data_nascimento = ?, email = ?, telefone = ?, endereco = ?, numero = ?, complemento = ?, bairro = ?, cep = ?, cidade_id = ?, ativo = ? 
            WHERE id = ?`, 
            [is_juridica, nome, apelido, cpf, rg, dataFormatada, email, telefone, endereco, numero, complemento, bairro, cep, cidade_id, ativo, id]
        );
        revalidatePath("/fornecedores");
        return { success: true, message: "Fornecedor atualizado com sucesso!" };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Erro no banco: Falha ao atualizar." };
    }
}

export async function deleteSupplier(id: number) {
    try {
        await query(`DELETE FROM supplier WHERE id = ?`, [id]);
        revalidatePath("/fornecedores");
        return { success: true, message: "Fornecedor excluído com sucesso." };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao excluir." };
    }
}
