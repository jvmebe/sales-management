import type { PageServerLoad, Actions } from "./$types";
import { query } from "$lib/db";
import { redirect, error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const results = await query(
    `SELECT s.id, s.nome, s.sigla, s.country_id, c.nome AS country_nome
     FROM state s
     JOIN country c ON s.country_id = c.id
     WHERE s.id = ?`,
    [id],
  );
  const state = results[0];

  if (!state) {
    throw error(404, "Estado não encontrado");
  }

  return { state };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const actionType = formData.get("action")?.toString();
    const { id } = params;

    if (actionType === "update") {
      const nome = formData.get("nome")?.toString();
      const sigla = formData.get("sigla")?.toString().toUpperCase();
      const country_id = formData.get("country_id")?.toString();

      if (!nome || !sigla || !country_id || sigla.length !== 2) {
        return { error: "Nome, sigla (2 letras) e país são obrigatórios" };
      }
      await query(
        "UPDATE state SET nome = ?, sigla = ?, country_id = ? WHERE id = ?",
        [nome, sigla, country_id, id],
      );
    } else if (actionType === "delete") {
      await query("DELETE FROM state WHERE id = ?", [id]);
    }
    throw redirect(303, "/estado");
  },
};
