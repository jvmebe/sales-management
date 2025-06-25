import { z } from 'zod';

export const clientSchema = z.object({
	id: z.number().int().positive().optional(),
	is_juridica: z.boolean().default(false),
	is_ativo: z.boolean().default(true),
	nome: z.string().min(3, 'O nome é obrigatório e deve ter no mínimo 3 caracteres.').max(100),
	apelido: z.string().max(100).optional().nullable(),
	cpf: z
		.string()
		.min(1, 'O CPF/CNPJ é obrigatório.')
		.max(14, 'O CPF/CNPJ deve ter no máximo 14 caracteres.'),
	rg: z.string().min(1, 'O RG/IE é obrigatório.').max(15),
	data_nascimento: z.string().min(1, 'A data é obrigatória.'),
	telefone: z.string().max(15).optional().nullable(),
	email: z.string().email('Formato de email inválido.').max(150).optional().nullable(),
	endereco: z.string().max(120).optional().nullable(),
	numero: z.coerce.number().int().optional().nullable(),
	bairro: z.string().max(100).optional().nullable(),
	cep: z.string().max(9).optional().nullable(),
	limite_credito: z.coerce.number().nonnegative('O limite não pode ser negativo.').default(0),
	cidade_id: z.coerce.number({ required_error: 'A cidade é obrigatória.' }).int().positive(),
	cond_pag_id: z
		.coerce
		.number({ required_error: 'A condição de pagamento é obrigatória.' })
		.int()
		.positive(),

	data_cadastro: z.string().optional(),
	data_ultima_edicao: z.string().nullable().optional(),

	
	cidade_nome: z.string().optional(),
	cond_pag_descricao: z.string().optional()
});

export type Client = z.infer<typeof clientSchema>;