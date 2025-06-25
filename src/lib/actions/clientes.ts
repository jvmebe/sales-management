"use server";
import { query } from "@/lib/db";
import { ClientForm, ClientSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { format } from 'date-fns';

const CLIENT_FIELDS = 'is_juridica, nome, apelido, cpf, rg, data_nascimento, telefone, email, endereco, numero, bairro, cep, limite_credito, cidade_id, cond_pag_id, ativo';

function formatData(data: ClientForm) {
    const { data_nascimento, ...rest } = data;
    const formattedBirthDate = data_nascimento ? format(data_nascimento, 'yyyy-MM-dd') : null;
    return { ...rest, data_nascimento: formattedBirthDate };
}

export async function createClient(data: ClientForm) {
  const result = ClientSchema.safeParse(data);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, message: firstError || "Erro de validação." };
  }

  const fields = formatData(result.data);
  
  try {
    await query(`INSERT INTO client (${CLIENT_FIELDS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [fields.is_juridica, fields.nome, fields.apelido, fields.cpf, fields.rg, fields.data_nascimento, fields.telefone, fields.email, fields.endereco, fields.numero, fields.bairro, fields.cep, fields.limite_credito, fields.cidade_id, fields.cond_pag_id, fields.ativo]
    );
    revalidatePath("/clientes");
    return { success: true, message: "Cliente criado com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao criar cliente." };
  }
}

export async function updateClient(id: number, data: ClientForm) {
    const result = ClientSchema.safeParse(data);
    if (!result.success) {
        const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
        return { success: false, message: firstError || "Erro de validação." };
    }

    const fields = formatData(result.data);
    
    try {
        await query(`
            UPDATE client SET is_juridica = ?, nome = ?, apelido = ?, cpf = ?, rg = ?, data_nascimento = ?, telefone = ?, email = ?, endereco = ?, numero = ?, bairro = ?, cep = ?, limite_credito = ?, cidade_id = ?, cond_pag_id = ?, ativo = ?
            WHERE id = ?`, 
            [fields.is_juridica, fields.nome, fields.apelido, fields.cpf, fields.rg, fields.data_nascimento, fields.telefone, fields.email, fields.endereco, fields.numero, fields.bairro, fields.cep, fields.limite_credito, fields.cidade_id, fields.cond_pag_id, fields.ativo, id]
        );
        revalidatePath("/clientes");
        return { success: true, message: "Cliente atualizado com sucesso!" };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao atualizar cliente." };
    }
}

export async function deleteClient(id: number) {
    try {
        await query(`DELETE FROM client WHERE id = ?`, [id]);
        revalidatePath("/clientes");
        return { success: true, message: "Cliente excluído com sucesso." };
    } catch (error) {
        return { success: false, message: "Erro no banco: Falha ao excluir cliente." };
    }
}
