import type { Actions, PageServerLoad } from "./$types";
import { query } from "$lib/db";
import { redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { employeeSchema } from "$lib/validation/employeeSchema";
import { zod } from "sveltekit-superforms/adapters";
import { fail } from "sveltekit-superforms";
import { citySchema } from '$lib/validation/citySchema';
import { stateSchema } from '$lib/validation/stateSchema';
import { countrySchema } from '$lib/validation/countrySchema';
import { createCity, createCountry, createState } from "$lib/actions/locationActions";

export const load: PageServerLoad = async () => {

  const form = await superValidate(zod(employeeSchema));
  const cityForm = await superValidate(zod(citySchema));
  const stateForm = await superValidate(zod(stateSchema));
  const countryForm = await superValidate(zod(countrySchema));

  return {
    form, cityForm, stateForm, countryForm
  };
};

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(employeeSchema));
    console.log(form.data)
    console.log(form.errors)
    if (!form.valid) {
      console.log(form.errors)
      return fail(400, {
        form,
      });
    }

    const birthDate = new Date(form.data.data_nascimento);
    form.data.data_nascimento = birthDate.toISOString().split("T")[0];
    

    await query(
      `INSERT INTO employee (nome, apelido, data_nascimento, cpf, rg, email, telefone, endereco, bairro, cep, cidade_id, ativo, matricula, cargo, salario, data_admissao, turno, carga_horaria)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        form.data.nome,
        form.data.apelido,
        birthDate,
        form.data.cpf,
        form.data.rg,
        form.data.email,
        form.data.telefone,
        form.data.endereco,
        form.data.bairro,
        form.data.cep,
        form.data.cidade_id,
        form.data.ativo,
        form.data.matricula,
        form.data.cargo,
        form.data.salario,
        form.data.data_admissao,
        form.data.turno,
        form.data.carga_horaria,
      ]
    );
    return {
      form
    }
  },
  city: createCity,
  state: createState,
  country: createCountry,
};
