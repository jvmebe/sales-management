import {z} from 'zod';

const installmentSchema = z.object({
  parcela_numero: z.coerce.number().int().min(1),
  forma_pagamento: z.coerce.number().int().min(1),
  valor_porcentagem: z.coerce.number().min(0).max(100),
  dias_vencimento: z.coerce.number().int().min(0)
});


export const formSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  num_parcelas: z.coerce.number().int().min(1),
  parcelas: z
    .array(installmentSchema)
    .min(1, 'Deve haver pelo menos uma parcela')
});

export type FormSchema = typeof formSchema;
