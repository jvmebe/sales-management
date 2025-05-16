import type { PageServerLoad, Actions } from "./$types";
import { query } from "$lib/db";
import { redirect, error } from "@sveltejs/kit";
import { formSchema } from "$lib/validation/stateSchema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";
import { fail } from "@sveltejs/kit";

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

  const form = await superValidate(state, zod(formSchema));

  return { form, state };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    console.log(form.data);

    await query(
      `UPDATE state SET nome = ?, sigla = ?, country_id = ? WHERE id = ?`,
      [form.data.nome, form.data.sigla, form.data.country_id, event.params.id],
    );
    redirect(303, '/estado');
  }
};
