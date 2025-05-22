import { z } from "zod";

export const formSchema = z.object({
  id: z.number().int().nonnegative(),

  nome: z.string().min(1).max(150),
  apelido: z.string().min(1).max(100),

  data_nascimento: z.string(),

  cpf: z.string().max(14),
  rg: z.string().max(15),

  email: z.string().email().max(150),
  telefone: z.string().max(15),

  endereco: z.string().max(120),
  numero: z.number().int(),
  complemento: z.string().max(100),
  bairro: z.string().max(100),

  cidade_id: z.number().int().nonnegative(),

  cep: z.string().max(9), // e.g., "12345-678"

  ativo: z.boolean().default(true),

  matricula: z.string().max(10),
  cargo: z.string().max(100),
  salario: z.number().nonnegative(),

  data_admissao: z.string(),
  
  data_demissao: z.string().optional(),

  turno: z.string().max(30),
  carga_horaria: z.number().int().nonnegative(),
});

export type FormSchema = typeof formSchema;
