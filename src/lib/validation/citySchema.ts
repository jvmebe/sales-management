import {z} from 'zod';

export const formSchema = z.object({
    nome: z.string().max(50).optional(),
    state_id: z.string().optional(),
})

export type FormSchema = typeof formSchema;
