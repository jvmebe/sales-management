"use server";
import { query } from '@/lib/db';
import { PaymentCondition, PaymentInstallment } from '@/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

// Busca a lista de condições (sem as parcelas, para a tabela principal)
export async function fetchPaymentConditions(): Promise<PaymentCondition[]> {
  noStore();
  try {
    const data = await query<PaymentCondition>(
      `SELECT id, descricao, ativo, (SELECT COUNT(*) FROM payment_installment pi WHERE pi.condicao_id = pc.id) as num_parcelas FROM payment_condition pc ORDER BY descricao ASC`
    );
    return data;
  } catch (error) {
    throw new Error('Failed to fetch payment conditions.');
  }
}

// Busca uma condição específica COM suas parcelas
export async function fetchPaymentConditionById(id: number): Promise<PaymentCondition | null> {
  noStore();
  const conditionData = await query<PaymentCondition>(`SELECT * FROM payment_condition WHERE id = ?`, [id]);
  if (conditionData.length === 0) return null;

  const installmentsData = await query<PaymentInstallment>(`SELECT * FROM payment_installment WHERE condicao_id = ? ORDER BY numero_parcela ASC`, [id]);
  
  const condition = conditionData[0];
  condition.parcelas = installmentsData;
  
  return condition;
}
