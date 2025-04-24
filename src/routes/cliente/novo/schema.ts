import {z} from "zod";

export const formSchema = z.object({
    is_juridico: z.enum(['true', 'false']),
    is_ativo: z.string().optional(),          // checkbox
    nome: z.string().min(1, 'Nome obrigatório'),
    apelido: z.string().min(1, 'Apelido obrigatório'),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    data_nascimento: z.string().optional(),
    email: z.string().email('Email inválido').optional(),
    telefone: z.string().optional(),
    endereco: z.string().optional(),
    bairro: z.string().optional(),
    cep: z.string().optional(),
    cidade_id: z.string().min(1, 'Cidade obrigatória'),
    inscricao_municipal: z.string().optional(),
    inscricao_estadual_substituto: z.string().optional()
  });

  export type FormSchema = typeof formSchema;