import {z} from 'zod';

export const supplierSchema = z.object({
    id: z.number().int().positive().optional(),
    is_juridica: z.boolean(),
    ativo: z.boolean().default(true),
    nome: z.string().max(100),
    apelido: z.string().max(100),
    cpf: z.string().length(11).optional().nullable(),
    rg: z.string().max(10).optional().nullable(),
    data_nascimento: z.string(),
    email: z.string().email().max(100).optional().nullable(),
    telefone: z.string().length(11).optional().nullable(),
    endereco: z.string().max(100).optional().nullable(),
    numero: z.coerce.number().int().optional().nullable(),
    complemento: z.string().max(100).optional().nullable(),
    bairro: z.string().max(100).optional().nullable(),
    cep: z.string().length(8).optional().nullable(),
    cidade_id: z.number().int().optional().nullable(),
    inscricao_estadual_substituto_tributario: z.string().max(50),
})

export type FormSchema = typeof supplierSchema;
