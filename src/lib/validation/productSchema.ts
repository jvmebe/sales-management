import { z } from 'zod';

export const productSchema = z.object({
	id: z.number().int().positive().optional(),
	nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.').max(40),
	descricao: z.string().max(80).optional().nullable(),
	codigo_barras: z.string().min(1, 'O código de barras é obrigatório.').max(13),
	
	brand_id: z.coerce.number({ required_error: 'A marca é obrigatória.' }).int().positive(),
	category_id: z.coerce.number({ required_error: 'A categoria é obrigatória.' }).int().positive(),
	unit_id: z.coerce.number({ required_error: 'A unidade de medida é obrigatória.' }).int().positive(),
	supplier_id: z.coerce.number({ required_error: 'O fornecedor é obrigatório.' }).int().positive(),

	valor_compra: z.coerce.number().nonnegative('O valor não pode ser negativo.'),
	valor_venda: z.coerce.number().nonnegative('O valor não pode ser negativo.'),
	percentual_lucro: z.coerce.number().nonnegative('O percentual não pode ser negativo.'),
	estoque: z.coerce.number().int('O estoque deve ser um número inteiro.').nonnegative(),
	
	ativo: z.boolean().default(true),

	// Campos de data gerenciados pelo backend
	data_cadastro: z.string().optional(),
	data_ultima_edicao: z.string().nullable().optional(),

    // Campos opcionais para exibir nomes nas listagens e formulários
    brand_name: z.string().optional(),
    category_name: z.string().optional(),
    unit_name: z.string().optional(),
    supplier_name: z.string().optional(),
});

// Exportando o tipo inferido
export type Product = z.infer<typeof productSchema>;