import type { Actions, PageServerLoad } from './$types';
import { query } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  // Carrega as formas de pagamento para o dropdown
  const paymentMethods = await query('SELECT * FROM payment_method');
  return { paymentMethods };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const descricao = formData.get('descricao')?.toString();
    const numParcelas = parseInt(formData.get('num_parcelas')?.toString() || '0');

    if (!descricao || !numParcelas) {
      return { error: 'Descrição e número de parcelas são obrigatórios' };
    }

    // Recupera os arrays dos campos das parcelas
    const parcelaNumeros = formData.getAll('parcela_numero').map(v => parseInt(v.toString()));
    const formaPagamentos = formData.getAll('forma_pagamento').map(v => parseInt(v.toString()));
    const valorPorcentagens = formData.getAll('valor_porcentagem').map(v => parseFloat(v.toString()));
    const diasVencimentos = formData.getAll('dias_vencimento').map(v => parseInt(v.toString()));

    // Validação: soma das porcentagens deve ser igual a 100%
    const totalPercentage = valorPorcentagens.reduce((sum, val) => sum + val, 0);
    if (totalPercentage !== 100) {
      return { 
        error: `A soma das porcentagens deve ser igual a 100%. Atualmente está em ${totalPercentage}%.`,
        formData: {
          descricao,
          numParcelas,
          installments: parcelaNumeros.map((p, index) => ({
            parcela_numero: p,
            forma_pagamento: formaPagamentos[index],
            valor_porcentagem: valorPorcentagens[index],
            dias_vencimento: diasVencimentos[index]
          }))
        }
      };
    }

    // Insere a condição de pagamento
    const result = await query(
      'INSERT INTO payment_condition (descricao, num_parcelas) VALUES (?, ?)',
      [descricao, numParcelas]
    );
    const conditionId = result.insertId;

    // Insere cada parcela na tabela payment_installment
    for (let i = 0; i < parcelaNumeros.length; i++) {
      await query(
        'INSERT INTO payment_installment (condicao_id, numero, forma_pagamento_id, valor_porcentagem, dias_vencimento) VALUES (?, ?, ?, ?, ?)',
        [conditionId, parcelaNumeros[i], formaPagamentos[i], valorPorcentagens[i], diasVencimentos[i]]
      );
    }

    throw redirect(303, '/condicao-de-pagamento');
  }
};
