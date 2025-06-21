import { z } from 'zod';

export const transportadoraSchema = z.object({
    id: z.number().int().positive().optional(),
    is_juridico: z.boolean().default(false), // Definindo um padrão
    ativo: z.boolean().default(true),
    nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.').max(100),
    apelido: z.string().max(100),
    cpf: z.string().length(11, 'O CPF deve ter 11 caracteres.').optional().nullable(),
    rg: z.string().max(10).optional().nullable(),
    data_nascimento: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Data de nascimento inválida",
    }),
    email: z.string().email('Formato de email inválido.').max(100).optional().nullable(),
    telefone: z.string().max(11).optional().nullable(),
    endereco: z.string().max(100).optional().nullable(),
    numero: z.coerce.number().int().optional().nullable(),
    complemento: z.string().max(100).optional().nullable(),
    bairro: z.string().max(100).optional().nullable(),
    cep: z.string().length(8, 'O CEP deve ter 8 caracteres.').optional().nullable(),
    cidade_id: z.coerce.number().int('A cidade é obrigatória.').positive('A cidade é obrigatória.').optional().nullable(),
    // O campo `cidade_nome` pode ser adicionado opcionalmente se você for usá-lo no formulário, como nos outros schemas.
    cidade_nome: z.string().optional(),
});

// Exportando o tipo inferido diretamente do schema
export type Transportadora = z.infer<typeof transportadoraSchema>;