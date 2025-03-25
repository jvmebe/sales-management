// src/routes/forma-de-pagamento/[id]/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const results = await query('SELECT * FROM payment_method WHERE id = ?', [id]);
  const paymentMethod = results[0];

  if (!paymentMethod) {
    throw error(404, 'Forma de pagamento não encontrada');
  }

  return { paymentMethod };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData();
    const actionType = formData.get('action')?.toString();
    const { id } = params;

    if (actionType === 'update') {
      const descricao = formData.get('descricao')?.toString();
      if (!descricao) {
        return { error: 'Descrição é obrigatória' };
      }
      await query('UPDATE payment_method SET descricao = ? WHERE id = ?', [descricao, id]);
    } else if (actionType === 'delete') {
      await query('DELETE FROM payment_method WHERE id = ?', [id]);
    }

    throw redirect(303, '/forma-pagamento');
  }
};
