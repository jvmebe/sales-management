"use server";

import { query } from "@/lib/db";
import { CityForm, CitySchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

export async function createCity(data: CityForm) {
  const result = CitySchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Erro de validação ao criar a cidade." };
  }
  
  const { nome, state_id, ativo } = result.data;
  try {
    await query(
      `INSERT INTO city (nome, state_id, ativo) VALUES (?, ?, ?)`,
      [nome, state_id, ativo]
    );
    revalidatePath("/cidades");
    return { success: true, message: "Cidade criada com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco de dados: Falha ao criar a cidade." };
  }
}

export async function updateCity(id: number, data: CityForm) {
  const result = CitySchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Erro de validação ao atualizar a cidade." };
  }

  const { nome, state_id, ativo } = result.data;
  try {
    await query(
      `UPDATE city SET nome = ?, state_id = ?, ativo = ? WHERE id = ?`,
      [nome, state_id, ativo, id]
    );
    revalidatePath("/cidades");
    return { success: true, message: "Cidade atualizada com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco de dados: Falha ao atualizar a cidade." };
  }
}

export async function deleteCity(id: number) {
  try {
    await query(`DELETE FROM city WHERE id = ?`, [id]);
    revalidatePath("/cidades");
    return { success: true, message: "Cidade excluída com sucesso." };
  } catch (error) {
    return { success: false, message: "Existem cadastros associados a esta cidade." };
  }
}