"use server";

import { query } from "@/lib/db";
import { StateForm, StateSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

export async function createState(data: StateForm) {
  const result = StateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Erro de validação." };
  }
  const { nome, sigla, country_id, ativo } = result.data;
  try {
    await query(
      `INSERT INTO state (nome, sigla, country_id, ativo) VALUES (?, ?, ?, ?)`,
      [nome, sigla, country_id, ativo]
    );
    revalidatePath("/estados");
    return { success: true, message: "Estado criado com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao criar estado." };
  }
}

export async function updateState(id: number, data: StateForm) {
  const result = StateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: "Erro de validação." };
  }
  const { nome, sigla, country_id, ativo } = result.data;
  try {
    await query(
      `UPDATE state SET nome = ?, sigla = ?, country_id = ?, ativo = ? WHERE id = ?`,
      [nome, sigla, country_id, ativo, id]
    );
    revalidatePath("/estados");
    return { success: true, message: "Estado atualizado com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao atualizar estado." };
  }
}

export async function deleteState(id: number) {
  // Adicionar verificação de dependência (cidades)
  const cities = await query(`SELECT id FROM city WHERE state_id = ?`, [id]);
  if (cities.length > 0) {
    return {
      success: false,
      message: "Não é possível excluir o estado, pois ele está sendo utilizado por uma ou mais cidades.",
    };
  }
  try {
    await query(`DELETE FROM state WHERE id = ?`, [id]);
    revalidatePath("/estados");
    return { success: true, message: "Estado excluído com sucesso." };
  } catch (error) {
    return { success: false, message: "Erro no banco: Falha ao excluir estado." };
  }
}