import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { citySchema } from '$lib/validation/citySchema';
import { stateSchema } from '$lib/validation/stateSchema';
import { countrySchema } from '$lib/validation/countrySchema';
import {zod} from "sveltekit-superforms/adapters"
import { fail } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {

    const cityForm = await superValidate(zod(citySchema));
    const stateForm = await superValidate(zod(stateSchema));
    const countryForm = await superValidate(zod(countrySchema));

  return {
    cityForm, stateForm, countryForm
   }
};
