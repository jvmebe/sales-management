"use server";

import { query } from "@/lib/db";
import { CountryForm, CountrySchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

export async function createCountry(data: CountryForm) {
  const result = CountrySchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Erro de validação. Por favor, corrija os campos.",
    };
  }

  const { nome, sigla } = result.data;

  try {
    await query(`INSERT INTO country (nome, sigla) VALUES (?, ?)`, [nome, sigla]);
  } catch (err) {
    // Pode ser um erro de entrada duplicada, etc.
    return {
      success: false,
      message: "Erro no banco de dados: Falha ao criar o país.",
    };
  }

  revalidatePath("/paises");
  return { success: true, message: "País criado com sucesso!" };
}

export async function updateCountry(id: number, data: CountryForm) {
  const result = CountrySchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Erro de validação. Por favor, corrija os campos.",
    };
  }

  const { nome, sigla } = result.data;

  try {
    await query(`UPDATE country SET nome = ?, sigla = ? WHERE id = ?`, [
      nome,
      sigla,
      id,
    ]);
  } catch (error) {
    return {
      success: false,
      message: "Erro no banco de dados: Falha ao atualizar o país.",
    };
  }

  revalidatePath("/paises");
  return { success: true, message: "País atualizado com sucesso!" };
}

export async function deleteCountry(id: number) {
  try {
    // Adicionar verificação se o país está sendo usado por um estado (integridade referencial)
    const states = await query(`SELECT id FROM state WHERE country_id = ?`, [id]);
    if (states.length > 0) {
      return {
        success: false,
        message: "Não é possível excluir o país, pois ele está sendo utilizado por um ou mais estados.",
      };
    }

    await query(`DELETE FROM country WHERE id = ?`, [id]);
    revalidatePath("/paises");
    return { success: true, message: "País excluído com sucesso." };
  } catch (error) {
    return {
      success: false,
      message: "Erro no banco de dados: Falha ao excluir o país.",
    };
  }
}