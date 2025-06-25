import { z } from 'zod';

export const productBrandSchema = z.object({
	id: z.number().int().positive().optional(),
	nome: z.string().min(1, 'O nome da marca é obrigatório.').max(40),
	ativo: z.boolean().default(true),

	data_cadastro: z.string().optional(),
	data_ultima_edicao: z.string().nullable().optional()
});

export type ProductBrand = z.infer<typeof productBrandSchema>;