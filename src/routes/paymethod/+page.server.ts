import { query } from "$lib/db";
import type { PageServerLoad } from "./$types";
import { json } from "@sveltejs/kit";

export async function load({ params }) {
  try {
    const sql = "SELECT * FROM payment_method";
    const results: any = await query(sql);
    const items = results;
    //console.log(data);
    return {
      items,
    };
  } catch (error) {
    console.log(error);
  }
}
