import {z} from 'zod';

export const payMethodSchema = z.object({
    descricao: z.string().max(50),
})

export type FormSchema = typeof payMethodSchema;
