import { z } from "zod";

export const employeeSchema = z.object({
  id: z.number().int().nonnegative(),

  nome: z.string().min(1).max(150),
  apelido: z.string().min(1).max(100),

  data_nascimento: z.string(),

  cpf: z.string().max(14),
  rg: z.string().max(15),

  email: z.string().email().max(150),
  telefone: z.string().max(15),

  endereco: z.string().max(120),
  numero: z.coerce.number().int(),
  complemento: z.string().max(100),
  bairro: z.string().max(100),

  cidade_id: z.coerce.number().int().nonnegative(),

  cep: z.string().max(9),

  ativo: z.boolean().default(true),

  matricula: z.string().max(10),
  cargo: z.string().max(100),
  salario: z.coerce.number().nonnegative(),

  data_admissao: z.string(),
  
  data_demissao: z.string().optional(),

  turno: z.string().max(30),
  carga_horaria: z.coerce.number().int().nonnegative(),
});

export type FormSchema = typeof employeeSchema;
