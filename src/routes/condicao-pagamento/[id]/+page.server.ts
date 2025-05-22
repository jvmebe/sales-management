import type { PageServerLoad, Actions } from './$types';
import { query, transaction } from '$lib/db';
import { redirect, error } from '@sveltejs/kit';
import { formSchema } from "$lib/validation/paycondSchema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";
import { fail } from "@sveltejs/kit";

interface Parcela {
  numero: number;
  forma_pagamento_id: number;
  valor_porcentagem: number;
  dias_vencimento: number;
  condicao_id: number; // previously venda_id
}

function compareParcelas(original:any, updated:any) {
  const changes = {
    modified: [],
    added: [],
    deleted: [],
    unchanged: []
  };

  const originalMap:any = new Map(original.map(p => [p.numero, p]));
  const updatedMap:any = new Map(updated.map(p => [p.numero, p]));

  for (const [numero, originalItem] of originalMap.entries()) {
    const updatedItem = updatedMap.get(numero);

    if (!updatedItem) {
      changes.deleted.push(originalItem);
    } else {
      const isSame =
        originalItem.forma_pagamento_id === updatedItem.forma_pagamento_id &&
        originalItem.valor_porcentagem === updatedItem.valor_porcentagem &&
        originalItem.dias_vencimento === updatedItem.dias_vencimento;

      if (isSame) {
        changes.unchanged.push(updatedItem);
      } else {
        changes.modified.push(updatedItem);
      }
    }
  }

  // Check for added
  for (const [numero, updatedItem] of updatedMap.entries()) {
    if (!originalMap.has(numero)) {
      changes.added.push(updatedItem);
    }
  }

  return changes;
}



export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const conditionResults:any = await query('SELECT * FROM payment_condition WHERE id = ?', [id]);
  const condition = conditionResults[0];

  if (!condition) {
    throw error(404, 'Condição de pagamento não encontrada');
  }

  condition.parcelas = await query(
    'SELECT * FROM payment_installment WHERE condicao_id = ? ORDER BY numero',
    [id]
  );

  const paymentMethods = await query('SELECT * FROM payment_method');

  const form = await superValidate(condition, zod(formSchema));

  return { form, condition, paymentMethods };
};

export const actions: Actions = {
  default: async (event) => {

    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const originalInstallments = await query(
      'SELECT * FROM payment_installment WHERE condicao_id = ? ORDER BY numero',
      [event.params.id]
    );

    const installments = form.data.parcelas;

    const changes:any = compareParcelas(originalInstallments, installments);

    await transaction(async (conn) => {

    await conn.query(
      `UPDATE payment_condition SET descricao = ?, num_parcelas = ? WHERE id = ?`,
      [form.data.descricao, form.data.num_parcelas, event.params.id]
    )

    for (const parcela of changes.added) {
      await conn.query(
        `INSERT INTO payment_installment 
          (condicao_id, numero, forma_pagamento_id, valor_porcentagem, dias_vencimento)
         VALUES (?, ?, ?, ?, ?)`,
        [
          event.params.id,
          parcela.numero,
          parcela.forma_pagamento_id,
          parcela.valor_porcentagem,
          parcela.dias_vencimento,
        ]
      );
    }

    for (const parcela of changes.modified) {
      await conn.query(
        `UPDATE payment_installment
         SET forma_pagamento_id = ?, valor_porcentagem = ?, dias_vencimento = ?
         WHERE condicao_id = ? AND numero = ?`,
        [
          parcela.forma_pagamento_id,
          parcela.valor_porcentagem,
          parcela.dias_vencimento,
          event.params.id,
          parcela.numero,
        ]
      );
    }

    for (const parcela of changes.deleted) {
      await conn.query(
        `DELETE FROM payment_installment
         WHERE condicao_id = ? AND numero = ?`,
        [event.params.id, parcela.numero]
      );
    }
    })

    redirect(303, '/condicao-pagamento')

  }
};
