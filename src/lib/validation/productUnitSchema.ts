import { z } from 'zod';

export const productUnitSchema = z.object({
	id: z.number().int().positive().optional(),
	nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.').max(40),
	sigla: z.string().min(1, 'A sigla é obrigatória.').max(5),
	ativo: z.boolean().default(true),

	data_cadastro: z.string().optional(),
	data_ultima_edicao: z.string().nullable().optional()
});

export type ProductUnit = z.infer<typeof productUnitSchema>;