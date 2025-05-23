import {z} from 'zod';

export const citySchema = z.object({
    nome: z.string().max(50).optional(),
    state_id: z.coerce.number().int(),
    state_nome: z.string().optional(),
})

export type FormSchema = typeof citySchema;
