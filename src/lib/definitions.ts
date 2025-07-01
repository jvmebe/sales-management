import { z } from 'zod';

export type Country = {
  id: number;
  nome: string;
  sigla: string;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;
};

export const CountrySchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(3, { message: 'O nome do país deve ter no mínimo 3 caracteres.' }).max(50, { message: "O nome do país não pode ter mais que 50 caracteres." }),
  sigla: z.string().length(2, { message: 'A sigla deve ter exatamente 2 caracteres.' }).toUpperCase(),
  ativo: z.coerce.boolean(),
});

export type CountryForm = z.infer<typeof CountrySchema>;


export type State = {
  id: number;
  nome: string;
  sigla: string;
  country_id: number;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;

  // Campo do JOIN
  country_nome?: string; 
};

export const StateSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(2, { message: "O nome do estado deve ter no mínimo 2 caracteres." }).max(50, { message: 'O nome do estado não pode ter mais que 50 caracteres.' }),
  sigla: z.string().length(2, { message: "A sigla deve ter exatamente 2 caracteres." }).toUpperCase(),
  country_id: z.coerce.number({ required_error: "Selecione um país." }).gt(0, { message: "Selecione um país." }),
  ativo: z.coerce.boolean(),
});

export type StateForm = z.infer<typeof StateSchema>;


export type City = {
  id: number;
  nome: string;
  state_id: number;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;

  // Campos de JOIN
  state_nome?: string;
  state_sigla?: string;
  country_nome?: string;
};

export const CitySchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(2, { message: "O nome da cidade é obrigatório." }).max(50, {message: "Nome da cidade não pode ter mais que 50 caracteres."}),
  state_id: z.coerce.number({ message: "Selecione um estado.", invalid_type_error:"Selecione um estado." }).gt(0, { message: "Selecione um estado." }),
  ativo: z.coerce.boolean(),
});

export type CityForm = z.infer<typeof CitySchema>;

export type PaymentMethod = {
  id: number;
  descricao: string;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;
};

export const PaymentMethodSchema = z.object({
  id: z.number().optional(),
  descricao: z.string().min(2, { message: "A descrição deve ter no mínimo 2 caracteres." }).max(50),
  ativo: z.coerce.boolean(),
});

export type PaymentMethodForm = z.infer<typeof PaymentMethodSchema>;

export type PaymentInstallment = {
  id?: number;
  condicao_id: number;
  numero_parcela: number;
  dias_vencimento: number;
  percentual_valor: number;
  forma_pagamento_id: number;
};

export type PaymentCondition = {
  id: number;
  descricao: string;
  juros: number;
  multa: number;
  desconto: number;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;
  parcelas: PaymentInstallment[];
};

const PaymentInstallmentSchema = z.object({
  numero_parcela: z.coerce.number().int().min(1),
  dias_vencimento: z.coerce.number().int().min(0, "Os dias devem ser 0 ou mais."),
  percentual_valor: z.coerce.number().min(0.01, "O percentual deve ser maior que zero.").max(100),
  forma_pagamento_id: z.coerce.number().min(1, "Selecione uma forma de pagamento."),
});

export const PaymentConditionSchema = z.object({
  id: z.number().optional(),
  descricao: z.string().min(3, "A descrição é obrigatória.").max(50, { message: "A descrição não pode ter mais que 50 caracteres." }),
  juros: z.coerce.number().min(0).optional(),
  multa: z.coerce.number().min(0).optional(),
  desconto: z.coerce.number().min(0).optional(),
  ativo: z.coerce.boolean(),
  parcelas: z.array(PaymentInstallmentSchema).min(1, "Adicione pelo menos uma parcela."),
}).refine(data => {
    const totalPercent = data.parcelas.reduce((sum, p) => sum + p.percentual_valor, 0);
    // Margem de erro da soma para casos onde 100% e impossivel
    return Math.abs(totalPercent - 100) < 0.001;
}, {
    message: "A soma dos percentuais das parcelas deve ser exatamente 100%.",
    path: ["parcelas"], // Associa erro ao campo de parcelas
});

export type PaymentConditionForm = z.infer<typeof PaymentConditionSchema>;


export type ProductUnit = {
  id: number;
  nome: string;
  sigla: string;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;
};

export const ProductUnitSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(2, { message: "O nome deve ter no mínimo 2 caracteres." }).max(80, { message: "O nome não pode ter mais que 80 caracteres." }),
  sigla: z.string().min(1, { message: "A sigla é obrigatória." }).max(10),
  ativo: z.coerce.boolean(),
});

export type ProductUnitForm = z.infer<typeof ProductUnitSchema>;

export type ProductBrand = {
  id: number;
  nome: string;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;
};

export const ProductBrandSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(2, { message: "O nome da marca deve ter no mínimo 2 caracteres." }).max(80, { message: "O nome da marca não pode ter mais que 80 caracteres." }),
  ativo: z.coerce.boolean(),
});

export type ProductBrandForm = z.infer<typeof ProductBrandSchema>;

export type ProductCategory = {
  id: number;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;
};

export const ProductCategorySchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(2, { message: "O nome da categoria deve ter no mínimo 2 caracteres." }).max(80, { message: "O nome da categoria não pode ter mais que 80 caracteres." }),
  descricao: z.string().optional().nullable(),
  ativo: z.coerce.boolean(),
});

export type ProductCategoryForm = z.infer<typeof ProductCategorySchema>;

export type Supplier = {
  id: number;
  is_juridica: boolean;
  nome: string;
  apelido: string | null;
  cpf: string | null;
  rg: string | null;
  data_nascimento: string | null;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cep: string | null;
  cidade_id: number | null;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;

  // Campo do JOIN da DB
  cidade_nome?: string;
};

export const SupplierSchema = z.object({
  id: z.number().optional(),
  is_juridica: z.coerce.boolean(),
  nome: z.string().min(3, "O nome/razão social é obrigatório.").max(80, "O nome/razão social não pode ter mais que 80 caracteres."),
  apelido: z.string().max(80, "O apelido/nome fantasia não pode ter mais que 80 caracteres.").optional().nullable(),
  cpf: z.string().max(14, "O CPF/CNPJ não pode ter mais que 14 caracteres.").optional().nullable(),
  rg: z.string().max(15, "O RG/IE não pode ter mais que 15 caracteres.").optional().nullable(),
  data_nascimento: z.date().optional().nullable(),
  email: z.string().email("Email inválido.").max(100, "O email não pode ter mais que 100 caracteres."),
  telefone: z.string().min(1, "O telefone é obrigatório.").max(15, "O telefone não pode ter mais que 15 caracteres."),
  endereco: z.string().min(1, "O endereço é obrigatório.").max(80, "O endereço não pode ter mais que 80 caracteres."),
  numero: z.string().min(1, "O número é obrigatório.").max(6, "O número não pode ter mais que 6 caracteres."),
  complemento: z.string().max(80, "O complemento não pode ter mais que 80 caracteres."),
  bairro: z.string().min(1, "O bairro é obrigatório.").max(80, "O bairro não pode ter mais que 80 caracteres."),
  cep: z.string().min(1, "O CEP é obrigatório.").max(8, "O CEP não pode ter mais que 8 caracteres."),
  cidade_id: z.coerce.number(),
  ativo: z.coerce.boolean(),
});

export type SupplierForm = z.infer<typeof SupplierSchema>;


export type Product = {
  id: number;
  nome: string;
  descricao: string | null;
  codigo_barras: string | null;
  valor_compra: number;
  valor_venda: number;
  estoque: number;
  brand_id: number | null;
  category_id: number | null;
  unit_id: number;
  supplier_id: number | null;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;
  
  // Campos de JOINs da DB
  brand_nome?: string;
  category_nome?: string;
  unit_sigla?: string;
};

export const ProductSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(3, "O nome do produto é obrigatório.").max(80, "O nome do produto não pode ter mais que 80 caracteres."),
  descricao: z.string().optional().nullable(),
  codigo_barras: z.string().max(20, "O código de barras não pode ter mais que 20 caracteres.").optional().nullable(),
  valor_compra: z.coerce.number().min(0, "O valor não pode ser negativo."),
  valor_venda: z.coerce.number().min(0, "O valor não pode ser negativo."),
  estoque: z.coerce.number().int("O estoque deve ser um número inteiro.").min(0),
  brand_id: z.coerce.number().optional().nullable(),
  category_id: z.coerce.number().optional().nullable(),
  unit_id: z.coerce.number().min(1, "A unidade de medida é obrigatória."),
  supplier_id: z.coerce.number().optional().nullable(),
  ativo: z.coerce.boolean().default(true),
});

export type ProductForm = z.infer<typeof ProductSchema>;

export type Transportadora = {
  id: number;
  is_juridico: boolean;
  nome: string;
  apelido: string | null;
  cpf: string | null;
  rg: string | null;
  data_nascimento: string | null;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cep: string | null;
  cidade_id: number | null;
  cidade_nome?: string;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;
};

export const TransportadoraSchema = z.object({
  id: z.number().optional(),
  is_juridico: z.boolean(),
  nome: z.string().min(3, "O nome/razão social é obrigatório."),
  apelido: z.string().optional().nullable(),
  cpf: z.string().optional().nullable(),
  rg: z.string().optional().nullable(),
  data_nascimento: z.date({ invalid_type_error: "Data inválida." }).optional().nullable(),
  email: z.string().email("Email inválido.").optional().nullable(),
  telefone: z.string().optional().nullable(),
  endereco: z.string().optional().nullable(),
  numero: z.string().optional().nullable(),
  complemento: z.string().optional().nullable(),
  bairro: z.string().optional().nullable(),
  cep: z.string().optional().nullable(),
  cidade_id: z.coerce.number().optional().nullable(),
  ativo: z.coerce.boolean(),
});

export type TransportadoraForm = z.infer<typeof TransportadoraSchema>;

export type Employee = {
  id: number;
  nome: string;
  apelido: string | null;
  data_nascimento: string | null;
  cpf: string | null;
  rg: string | null;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade_id: number | null;
  cidade_nome?: string;
  cep: string | null;
  ativo: boolean;
  matricula: string | null;
  cargo: string | null;
  salario: number | null;
  data_admissao: string | null;
  turno: string | null;
  carga_horaria: number | null;
  data_criacao: string;
  data_modificacao: string;
};

export const EmployeeSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(3, "O nome é obrigatório.")
    .max(80, "O nome não pode ter mais que 80 caracteres."),
  apelido: z.string()
    .max(80, "O apelido não pode ter mais que 80 caracteres.").optional().nullable(),
  data_nascimento: z.date({ invalid_type_error: "Data inválida." }).optional().nullable(),
  cpf: z.string()
    .max(14, "O CPF não pode ter mais que 14 caracteres.").optional().nullable(),
  rg: z.string()
    .max(15, "O RG não pode ter mais que 15 caracteres.").optional().nullable(),
  email: z.string().email("Email inválido.").max(100, "O email não pode ter mais que 100 caracteres."),
  telefone: z.string().min(1, "O telefone é obrigatório.").max(15, "O telefone não pode ter mais que 15 caracteres."),
  endereco: z.string().min(1, "O endereço é obrigatório.").max(80, "O endereço não pode ter mais que 80 caracteres."),
  numero: z.string().min(1, "O número é obrigatório.").max(6, "O número não pode ter mais que 6 caracteres."),
  complemento: z.string().max(80, "O complemento não pode ter mais que 80 caracteres."),
  bairro: z.string().min(1, "O bairro é obrigatório.").max(80, "O bairro não pode ter mais que 80 caracteres."),
  cidade_id: z.coerce.number().min(1, "A cidade é obrigatória."),
  cep: z.string().min(1, "O CEP é obrigatório.").max(9, "O CEP não pode ter mais que 9 caracteres."),
  ativo: z.coerce.boolean().default(true),
  matricula: z.string().min(1, "A matrícula é obrigatória.").max(15, "A matrícula não pode ter mais que 15 caracteres."),
  cargo: z.string().min(1, "O cargo é obrigatório.").max(50, "O cargo não pode ter mais que 50 caracteres."),
  salario: z.coerce.number().min(0, "O salário não pode ser negativo."),
  data_admissao: z.date({ required_error: "A data de admissão é obrigatória.", invalid_type_error: "Data inválida." }),
  turno: z.string()
    .max(20, "O turno não pode ter mais que 20 caracteres.").optional().nullable(),
  carga_horaria: z.coerce.number().int().min(0).optional().nullable(),
});

export type EmployeeForm = z.infer<typeof EmployeeSchema>;

export type Client = {
  id: number;
  is_juridica: boolean;
  nome: string;
  apelido: string | null;
  cpf: string | null;
  rg: string | null;
  data_nascimento: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cep: string | null;
  limite_credito: number;
  cidade_id: number | null;
  cond_pag_id: number;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;
  
  // Campos de JOINs da DB
  cidade_nome?: string;
  cond_pag_descricao?: string;
};

export const ClientSchema = z.object({
  id: z.number().optional(),
  is_juridica: z.coerce.boolean(),
  nome: z.string().min(3, "O nome/razão social é obrigatório.")
    .max(80, "O nome/razão social não pode ter mais que 80 caracteres."),
  apelido: z.string()
    .max(80, "O apelido/nome fantasia não pode ter mais que 80 caracteres.").optional().nullable(),
  cpf: z.string().min(11, "CPF/CNPJ inválido.")
    .max(14, "CPF/CNPJ não pode ter mais que 14 caracteres.").optional().nullable(),
  rg: z.string()
    .max(15, "O RG/IE não pode ter mais que 15 caracteres.").optional().nullable(),
  data_nascimento: z.date({ required_error: "A data de nascimento é obrigatória.", invalid_type_error: "Data inválida." }),
  telefone: z.string()
    .max(15, "O telefone não pode ter mais que 15 caracteres.").optional().nullable(),
  email: z.string().email("Email inválido.")
    .max(100, "O email não pode ter mais que 100 caracteres.").optional().nullable(),
  endereco: z.string().min(1, "O endereço é obrigatório.").max(80, "O endereço não pode ter mais que 80 caracteres."),
  numero: z.string().min(1, "O número é obrigatório.").max(6, "O número não pode ter mais que 6 caracteres."),
  bairro: z.string().min(1, "O bairro é obrigatório.").max(80, "O bairro não pode ter mais que 80 caracteres."),
  cep: z.string().min(1, "O CEP é obrigatório.").max(8, "O CEP não pode ter mais que 8 caracteres."),
  limite_credito: z.coerce.number().min(0),
  cidade_id: z.coerce.number().min(1, "A cidade é obrigatória."),
  cond_pag_id: z.coerce.number().min(1, "A condição de pagamento é obrigatória."),
  ativo: z.coerce.boolean(),
});

export type ClientForm = z.infer<typeof ClientSchema>;