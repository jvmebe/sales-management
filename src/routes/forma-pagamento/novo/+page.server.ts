import type { Actions } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const descricao = formData.get('descricao')?.toString();

    if (!descricao) {
      return { error: 'Descrição é obrigatória' };
    }

    await query('INSERT INTO payment_method (descricao) VALUES (?)', [descricao]);

    throw redirect(303, '/forma-pagamento');
  }
};
