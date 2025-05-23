import type { PageServerLoad, Actions } from "./$types";
import { query } from "$lib/db";
import { redirect, error } from "@sveltejs/kit";
import { payMethodSchema } from "$lib/validation/paymentSchema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const results:any = await query("SELECT * FROM payment_method WHERE id = ?", [
    id,
  ]);
  const paymentMethod = results[0];

  if (!paymentMethod) {
    throw error(404, "Forma de pagamento não encontrada");
  }

  const form = await superValidate(paymentMethod, zod(payMethodSchema));

  return { paymentMethod, form };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(payMethodSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    await query("UPDATE payment_method SET descricao = ? WHERE id = ?", [
      form.data.descricao,
      event.params.id,
    ]);

    throw redirect(303, "/forma-pagamento");
  },
};
