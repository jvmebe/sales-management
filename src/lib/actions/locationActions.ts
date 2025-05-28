import { query } from "$lib/db";
import { citySchema } from "$lib/validation/citySchema";
import { countrySchema } from "$lib/validation/countrySchema";
import { stateSchema } from "$lib/validation/stateSchema";
import type { Action } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

// CIDADE ----------------------------------------------------
export const createCity: Action = async (event) => {
  const form = await superValidate(event, zod(citySchema));
  console.log(form.errors);
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

// ESTADO ----------------------------------------------------

export const createState: Action = async (event) => {
  const form = await superValidate(event, zod(stateSchema));
  if (!form.valid) {
    return fail(400, {
      form,
    });
  }

  console.log(form.data);

  await query(`INSERT INTO state (nome, sigla, country_id) VALUES (?, ?, ?)`, [
    form.data.nome,
    form.data.sigla,
    form.data.country_id,
  ]);
  return {
    form,
  };
};

// PAIS -------------------------------------------------------

export const createCountry: Action = async (event) => {
  const form = await superValidate(event, zod(countrySchema));
  console.log(form.data);
  if (!form.valid) {
    console.log(form.errors);
    return fail(400, {
      form,
    });
  }

  await query(
    `INSERT INTO country (
          nome, sigla
        ) VALUES (?, ?)`,
    [form.data.nome, form.data.sigla]
  );
  return {
    form,
  };
};
