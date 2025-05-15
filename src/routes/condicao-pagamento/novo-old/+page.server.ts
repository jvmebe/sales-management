// src/routes/condicao-de-pagamento/novo/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
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
    console.log(formData);
    return;
    const descricao = formData.get('descricao')?.toString();
    const numParcelas = parseInt(formData.get('num_parcelas')?.toString() || '0', 10);

    // Valida campos básicos
    if (!descricao || numParcelas <= 0) {
      return { error: 'Descrição e número de parcelas são obrigatórios.' };
    }

    // Recupera os arrays enviados pelo cliente
    const parcelaNumeros = formData
      .getAll('parcela_numero')
      .map(v => parseInt(v.toString(), 10));
    const formaPagamentos = formData
      .getAll('forma_pagamento')
      .map(v => parseInt(v.toString(), 10));
    const valorPorcentagens = formData
      .getAll('valor_porcentagem')
      .map(v => parseFloat(v.toString()));
    const diasVencimentos = formData
      .getAll('dias_vencimento')
      .map(v => parseInt(v.toString(), 10));

    // Soma bruta e arredondada a duas casas
    const rawSum = valorPorcentagens.reduce((sum, val) => sum + val, 0);
    const totalPercentage = parseFloat(rawSum.toFixed(2));

    // Valida soma = 100.00 após arredondar
    if (totalPercentage !== 100) {
      return {
        error: `A soma das porcentagens deve ser 100%. Atualmente está em ${totalPercentage}%.`
      };
    }

    // Insere a condição de pagamento
    const result: any = await query(
      'INSERT INTO payment_condition (descricao, num_parcelas) VALUES (?, ?)',
      [descricao, numParcelas]
    );
    const conditionId = result.insertId;

    // Insere cada parcela
    for (let i = 0; i < parcelaNumeros.length; i++) {
      await query(
        `INSERT INTO payment_installment
         (condicao_id, numero, forma_pagamento_id, valor_porcentagem, dias_vencimento)
         VALUES (?, ?, ?, ?, ?)`,
        [
          conditionId,
          parcelaNumeros[i],
          formaPagamentos[i],
          valorPorcentagens[i],
          diasVencimentos[i]
        ]
      );
    }

    // Redireciona para a lista ao final
    throw redirect(303, '/condicao-pagamento');
  }
};
