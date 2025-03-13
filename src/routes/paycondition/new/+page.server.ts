import { json, redirect, type Actions } from "@sveltejs/kit";
import {query} from '$lib/db';

export const actions = {
    default: async ({request}) => {
        const data = await request.formData();
        //console.log(data.get('DESCRIPTION'));
        console.log()
        const sql = 'INSERT INTO payment_condition (DESCRIPTION, INSTALLMENT_QTY) VALUES (?, ?)'
        await query(sql, [data.get('DESCRIPTION'), data.get('INSTALLMENT_QTY')])

        redirect(303, '/paycondition')
    }
} satisfies Actions;


