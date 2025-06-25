import { z } from 'zod';

export const productCategorySchema = z.object({
	id: z.number().int().positive().optional(),
	nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.').max(40),
	descricao: z.string().max(80).optional().nullable(),
	ativo: z.boolean().default(true),

	// Campos de data gerenciados pelo backend, não editáveis pelo usuário.
	// Definidos como string, pois virão do banco nesse formato via JSON.
	data_cadastro: z.string().optional(),
	data_ultima_edicao: z.string().nullable().optional()
});

// Exportando o tipo inferido para uso futuro
export type ProductCategory = z.infer<typeof productCategorySchema>;