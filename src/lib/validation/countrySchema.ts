import {z} from 'zod';

export const countrySchema = z.object({
    nome: z.string().max(50).min(3),
    sigla: z.string().length(2),
})

export type FormSchema = typeof countrySchema;
