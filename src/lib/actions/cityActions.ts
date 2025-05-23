import type { Action, Actions } from "@sveltejs/kit";
import { query } from "$lib/db";
import { redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { citySchema } from "$lib/validation/citySchema";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from "sveltekit-superforms";

export const saveCity: Action = async (event) => {
  const form = await superValidate(event, zod(citySchema));
  console.log("WOOOO:", form.errors);
  if (!form.valid) {
    return fail(400, {
      form,
    });
  }

  console.log(form.data);

  await query(`INSERT INTO city (nome, state_id) VALUES (?, ?)`, [
    form.data.nome,
    form.data.state_id,
  ]);
  return {
    form,
  };
};
