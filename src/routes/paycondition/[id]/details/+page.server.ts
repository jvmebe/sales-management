import {query} from '$lib/db';
import { json, redirect, type Actions } from "@sveltejs/kit";

export async function load({ params }) {
    try {
        const sql = 'SELECT * FROM payment_condition WHERE ID = ?';
        const results:any = await query(sql, [params.id]);
        const condition = results[0];
        console.log(condition);
        return {
            condition
        };
    }
    catch (error) {
        console.log(error);
    } 
}

export const actions = {
    edit: async ({request}) => {
        const data = await request.formData();
        console.log("WHAT" + data.get('ID'));
        const sql = 'UPDATE payment_condition SET DESCRIPTION = ?, INSTALLMENT_QTY = ? WHERE ID = ?;'
        console.log(await query(sql, [data.get('DESCRIPTION'), data.get('INSTALLMENT_QTY'), data.get('ID')]))

        redirect(303, '/paycondition')
    },
    delete: async ({ request }) => {
        const data = await request.formData();
    }
} satisfies Actions;