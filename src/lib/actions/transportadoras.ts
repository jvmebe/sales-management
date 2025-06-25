"use server";
import { query } from "@/lib/db";
import { TransportadoraForm, TransportadoraSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { format } from 'date-fns';

const FIELDS = 'is_juridico, nome, apelido, cpf, rg, data_nascimento, email, telefone, endereco, numero, complemento, bairro, cep, cidade_id, ativo';

export async function createTransportadora(data: TransportadoraForm) {
  const result = TransportadoraSchema.safeParse(data);
  if (!result.success) return { success: false, message: "Erro de validação." };

  const { data_nascimento, ...rest } = result.data;
  const formattedDate = data_nascimento ? format(data_nascimento, 'yyyy-MM-dd') : null;

  try {
    await query(`INSERT INTO transportadora (${FIELDS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [rest.is_juridico, rest.nome, rest.apelido, rest.cpf, rest.rg, formattedDate, rest.email, rest.telefone, rest.endereco, rest.numero, rest.complemento, rest.bairro, rest.cep, rest.cidade_id, rest.ativo]
    );
    revalidatePath("/transportadoras");
    return { success: true, message: "Transportadora criada com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao criar transportadora." };
  }
}

export async function updateTransportadora(id: number, data: TransportadoraForm) {
    const result = TransportadoraSchema.safeParse(data);
    if (!result.success) return { success: false, message: "Erro de validação." };

    const { data_nascimento, ...rest } = result.data;
    const formattedDate = data_nascimento ? format(data_nascimento, 'yyyy-MM-dd') : null;
    
    try {
        await query(`
            UPDATE transportadora SET is_juridico = ?, nome = ?, apelido = ?, cpf = ?, rg = ?, data_nascimento = ?, email = ?, telefone = ?, endereco = ?, numero = ?, complemento = ?, bairro = ?, cep = ?, cidade_id = ?, ativo = ? 
            WHERE id = ?`, 
            [rest.is_juridico, rest.nome, rest.apelido, rest.cpf, rest.rg, formattedDate, rest.email, rest.telefone, rest.endereco, rest.numero, rest.complemento, rest.bairro, rest.cep, rest.cidade_id, rest.ativo, id]
        );
        revalidatePath("/transportadoras");
        return { success: true, message: "Transportadora atualizada com sucesso!" };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao atualizar." };
    }
}

export async function deleteTransportadora(id: number) {
    try {
        await query(`DELETE FROM transportadora WHERE id = ?`, [id]);
        revalidatePath("/transportadoras");
        return { success: true, message: "Transportadora excluída com sucesso." };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao excluir." };
    }
}
