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
  rg: z.string().max(10).min(6, "Campo obrigatório"),
  data_nascimento: z.string(),
  telefone: z.string().max(11),
  email: z.string().max(100).email("Email inválido"),
  endereco: z.string().max(100),
  numero: z.coerce.number().int(),
  complemento: z.string().max(100).optional(),
  bairro: z.string().max(100).min(3, "Campo obrigatório"),
  cep: z.string().length(8, 'CEP deve conter 8 dígitos'),
  limite_credito: z.coerce.number(),
  cidade_id: z.coerce.number().int(),
  cond_pag_id: z.coerce.number().int(),
  cond_pag_nome: z.string(),
});



  export type FormSchema = typeof formSchema;
