import { z } from "zod";

export const formSchema = z.object({
  id: z.number().int(), // normalmente omitido em criação, mas incluso se necessário
  is_juridica: z.boolean(),
  is_ativo: z.boolean(),
  nome: z.string().max(100).min(3, "Campo obrigatório"),
  apelido: z.string().max(100).optional(),
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF/CNPJ deve conter 11 dígitos numéricos'),
  rg: z.string().max(10),
  data_nascimento: z.coerce.date(),
  telefone: z.string().max(11),
  email: z.string().max(100).email(),
  endereco: z.string().max(100),
  numero: z.coerce.number().int(),
  bairro: z.string().max(100),
  cep: z.string().length(8, 'CEP deve conter 8 dígitos'),
  limite_credito: z.coerce
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Valor inválido')
    .transform((val) => parseFloat(val)),
  cidade_id: z.coerce.number().int(),
  cond_pag_id: z.coerce.number().int(),
});



  export type FormSchema = typeof formSchema;
