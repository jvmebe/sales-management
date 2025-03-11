import {json} from '@sveltejs/kit';
import {query} from '$lib/db';

export const GET = async () => {
    try {
        const sql = 'SELECT * FROM payment_condition';
        const results = await query(sql);
        console.log(JSON.stringify(results));
        return json(results);
    }
    catch (error) {
        json(error)
    }
}