import {z} from 'zod';

export const stateSchema = z.object({
    nome: z.string().max(50).min(3, 'Nome deve conter pelo menos 3 caracteres'),
    sigla: z.string().length(2, 'Sigla deve conter 2 caracteres'),
    country_id: z.coerce.number().int(),
    country_nome: z.string().optional(),
})

export type FormSchema = typeof stateSchema;
