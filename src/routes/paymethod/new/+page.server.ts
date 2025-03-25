import { json, redirect, type Actions } from "@sveltejs/kit";
import { query } from "$lib/db";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    //console.log(data.get('DESCRIPTION'));
    console.log();
    const sql = "INSERT INTO payment_method (DESCRIPTION) VALUES (?)";
    await query(sql, [data.get("DESCRIPTION")]);

    redirect(303, "/paymethod");
  },
} satisfies Actions;
