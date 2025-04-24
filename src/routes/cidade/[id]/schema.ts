import {z} from 'zod';

export const formSchema = z.object({
    nome: z.string().min(5).max(50),
    state_id: z.string(),
})

export type FormSchema = typeof formSchema;