import {z} from 'zod';

export const formSchema = z.object({
    descricao: z.string().max(50),
})

export type FormSchema = typeof formSchema;
