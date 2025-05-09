import {z} from 'zod';

export const formSchema = z.object({
    nome: z.string().max(50).optional(),
    state_id: z.coerce.number().int(),
  state_nome: z.string(),
})

export type FormSchema = typeof formSchema;
