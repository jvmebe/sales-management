"use server";

import { query } from "@/lib/db";
import { CountryForm, CountrySchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

export async function createCountry(data: CountryForm) {
  const result = CountrySchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Erro de validação." };
  }

  const { nome, sigla, ativo } = result.data;
  try {
    await query(
      `INSERT INTO country (nome, sigla, ativo) VALUES (?, ?, ?)`,
      [nome, sigla, ativo]
    );
    revalidatePath("/paises");
    return { success: true, message: "País criado com sucesso!" };
  } catch (err) {
    return { success: false, message: "Erro no banco de dados: Falha ao criar o país." };
  }
}

export async function updateCountry(id: number, data: CountryForm) {
  const result = CountrySchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Erro de validação." };
  }

  const { nome, sigla, ativo } = result.data;
  try {
    await query(
      `UPDATE country SET nome = ?, sigla = ?, ativo = ? WHERE id = ?`,
      [nome, sigla, ativo, id]
    );
    revalidatePath("/paises");
    return { success: true, message: "País atualizado com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco de dados: Falha ao atualizar o país." };
  }
}

export async function deleteCountry(id: number) {
  try {
    const states = await query(`SELECT id FROM state WHERE country_id = ? LIMIT 1`, [id]);
    if (states.length > 0) {
      return {
        success: false,
        message: "Não é possível excluir: país em uso por um ou mais estados.",
      };
    }
    await query(`DELETE FROM country WHERE id = ?`, [id]);
    revalidatePath("/paises");
    return { success: true, message: "País excluído com sucesso." };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao excluir o país." };
  }
}
