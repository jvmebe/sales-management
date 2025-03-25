import type { PageServerLoad, Actions } from './$types';
import { query } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const conditionResults = await query('SELECT * FROM payment_condition WHERE id = ?', [id]);
  const condition = conditionResults[0];

  if (!condition) {
    throw error(404, 'Condição de pagamento não encontrada');
  }

  const installments = await query(
    'SELECT * FROM payment_installment WHERE condicao_id = ? ORDER BY numero',
    [id]
  );
  const paymentMethods = await query('SELECT * FROM payment_method');

  return { condition, installments, paymentMethods };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const { id } = params;
    const formData = await request.formData();
    const actionType = formData.get('action')?.toString();

    if (actionType === 'update') {
      
      const descricao = formData.get('descricao')?.toString();
      const numParcelas = parseInt(formData.get('num_parcelas')?.toString() || '0');
      if (!descricao || !numParcelas) {
        return { error: 'Descrição e número de parcelas são obrigatórios' };
      }
      await query(
        'UPDATE payment_condition SET descricao = ?, num_parcelas = ? WHERE id = ?',
        [descricao, numParcelas, id]
      );

      // Exclui parcelas removidas e regrava as atuais 
      await query('DELETE FROM payment_installment WHERE condicao_id = ?', [id]);

      const parcelaNumeros = formData.getAll('parcela_numero').map(v => parseInt(v.toString()));
      const formaPagamentos = formData.getAll('forma_pagamento').map(v => parseInt(v.toString()));
      const valorPorcentagens = formData.getAll('valor_porcentagem').map(v => parseFloat(v.toString()));
      const diasVencimentos = formData.getAll('dias_vencimento').map(v => parseInt(v.toString()));

      for (let i = 0; i < parcelaNumeros.length; i++) {
        await query(
          'INSERT INTO payment_installment (condicao_id, numero, forma_pagamento_id, valor_porcentagem, dias_vencimento) VALUES (?, ?, ?, ?, ?)',
          [id, parcelaNumeros[i], formaPagamentos[i], valorPorcentagens[i], diasVencimentos[i]]
        );
      }
    } else if (actionType === 'delete') {
      // Exclui TUDO
      await query('DELETE FROM payment_installment WHERE condicao_id = ?', [id]);
      await query('DELETE FROM payment_condition WHERE id = ?', [id]);
    }

    throw redirect(303, '/condicao-pagamento');
  }
};
