import {z} from 'zod';

export const formSchema = z.object({
    nome: z.string().max(50).min(3),
    sigla: z.string().length(2),
})

export type FormSchema = typeof formSchema;
