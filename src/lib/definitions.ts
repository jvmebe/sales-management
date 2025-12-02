import { z } from "zod";

//VALIDACAO CNPJ =============================================================================================

function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj.length !== 14) return false;

  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}

// VALIDACAO DE CPF ==============================================================================================

function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i++)
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

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
  nome: z
    .string()
    .min(3, { message: "O nome do país deve ter no mínimo 3 caracteres." })
    .max(50, {
      message: "O nome do país não pode ter mais que 50 caracteres.",
    }),
  sigla: z
    .string()
    .length(2, { message: "A sigla deve ter exatamente 2 caracteres." })
    .toUpperCase(),
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
  nome: z
    .string()
    .min(2, { message: "O nome do estado deve ter no mínimo 2 caracteres." })
    .max(50, {
      message: "O nome do estado não pode ter mais que 50 caracteres.",
    }),
  sigla: z
    .string()
    .length(2, { message: "A sigla deve ter exatamente 2 caracteres." })
    .toUpperCase(),
  country_id: z.coerce
    .number({ required_error: "Selecione um país." })
    .gt(0, { message: "Selecione um país." }),
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
  nome: z
    .string()
    .min(2, { message: "O nome da cidade é obrigatório." })
    .max(50, {
      message: "Nome da cidade não pode ter mais que 50 caracteres.",
    }),
  state_id: z.coerce
    .number({
      message: "Selecione um estado.",
      invalid_type_error: "Selecione um estado.",
    })
    .gt(0, { message: "Selecione um estado." }),
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
  descricao: z
    .string()
    .min(2, { message: "A descrição deve ter no mínimo 2 caracteres." })
    .max(50),
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
  dias_vencimento: z.coerce
    .number()
    .int()
    .min(0, "Os dias devem ser 0 ou mais."),
  percentual_valor: z.coerce
    .number()
    .min(0.01, "O percentual deve ser maior que zero.")
    .max(100),
  forma_pagamento_id: z.coerce
    .number()
    .min(1, "Selecione uma forma de pagamento."),
});

export const PaymentConditionSchema = z
  .object({
    id: z.number().optional(),
    descricao: z
      .string()
      .min(3, "A descrição é obrigatória.")
      .max(50, { message: "A descrição não pode ter mais que 50 caracteres." }),
    juros: z.coerce.number().min(0).optional(),
    multa: z.coerce.number().min(0).optional(),
    desconto: z.coerce.number().min(0).optional(),
    ativo: z.coerce.boolean(),
    parcelas: z
      .array(PaymentInstallmentSchema)
      .min(1, "Adicione pelo menos uma parcela."),
  })
  .refine(
    (data) => {
      const totalPercent = data.parcelas.reduce(
        (sum, p) => sum + p.percentual_valor,
        0,
      );
      // Margem de erro da soma para casos onde 100% e impossivel
      return Math.abs(totalPercent - 100) < 0.001;
    },
    {
      message: "A soma dos percentuais das parcelas deve ser exatamente 100%.",
      path: ["parcelas"], // Associa erro ao campo de parcelas
    },
  );

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
  nome: z
    .string()
    .min(2, { message: "O nome deve ter no mínimo 2 caracteres." })
    .max(80, { message: "O nome não pode ter mais que 80 caracteres." }),
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
  nome: z
    .string()
    .min(2, { message: "O nome da marca deve ter no mínimo 2 caracteres." })
    .max(80, {
      message: "O nome da marca não pode ter mais que 80 caracteres.",
    }),
  ativo: z.coerce.boolean().default(true),
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
  nome: z
    .string()
    .min(2, { message: "O nome da categoria deve ter no mínimo 2 caracteres." })
    .max(80, {
      message: "O nome da categoria não pode ter mais que 80 caracteres.",
    }),
  descricao: z.string().optional().nullable().default(null),
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
  payment_condition_id: number | null;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;

  // Campos de JOIN da DB
  cidade_nome?: string;
  payment_condition_descricao?: string;
};

export const SupplierSchema = z.object({
  id: z.number().optional(),
  is_juridica: z.coerce.boolean(),
  nome: z
    .string({ message: "Campo obrigatório." })
    .min(3, "Campo deve ter pelo menos 3 caracteres.")
    .max(80, "Campo não pode ter mais que 80 caracteres."),
  apelido: z
    .string()
    .max(80, "O apelido/nome fantasia não pode ter mais que 80 caracteres.")
    .optional()
    .nullable()
    .default(null),
  cpf: z
    .string({ message: "Campo obrigatório." })
    .transform((val) => val.replace(/[^\d]/g, ""))
    .refine((val) => val.length === 11 || val.length === 14, {
      message: "O CPF/CNPJ deve ter 11 ou 14 caracteres.",
    })
    .refine(
      (val) => {
        if (val.length === 11) {
          return validarCPF(val);
        }
        if (val.length === 14) {
          return validarCNPJ(val);
        }
        return false;
      },
      {
        message: "O CPF ou CNPJ informado é inválido.",
      },
    ),
  rg: z
    .string()
    .max(15, "O RG/IE não pode ter mais que 15 caracteres.")
    .optional()
    .nullable()
    .default(null),
  data_nascimento: z.date({ message: "Campo obrigatório." }),
  email: z
    .string()
    .email("Email inválido.")
    .max(100, "O email não pode ter mais que 100 caracteres."),
  telefone: z
    .string()
    .min(1, "O telefone é obrigatório.")
    .max(15, "O telefone não pode ter mais que 15 caracteres."),
  endereco: z
    .string()
    .min(1, "O endereço é obrigatório.")
    .max(80, "O endereço não pode ter mais que 80 caracteres."),
  numero: z
    .string()
    .min(1, "O número é obrigatório.")
    .max(6, "O número não pode ter mais que 6 caracteres."),
  complemento: z
    .string()
    .max(80, "O complemento não pode ter mais que 80 caracteres.")
    .optional()
    .nullable()
    .default(null),
  bairro: z
    .string()
    .min(1, "O bairro é obrigatório.")
    .max(80, "O bairro não pode ter mais que 80 caracteres."),
  cep: z
    .string()
    .min(1, "O CEP é obrigatório.")
    .max(8, "O CEP não pode ter mais que 8 caracteres."),
  cidade_id: z.coerce.number(),
  payment_condition_id: z.coerce.number().optional().nullable(), // NOVO CAMPO
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
  supplier_ids: number[] | null;
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
  nome: z
    .string({ message: "Campo obrigatório." })
    .min(3, "Nome deve ter pelo menos 3 caracteres.")
    .max(80, "O nome do produto não pode ter mais que 80 caracteres."),
  descricao: z.string().optional().nullable().default(null),
  codigo_barras: z
    .string()
    .max(20, "O código de barras não pode ter mais que 20 caracteres.")
    .optional()
    .nullable()
    .default(null),
  valor_compra: z.coerce.number().min(0, "O valor não pode ser negativo."),
  valor_venda: z.coerce.number().min(0, "O valor não pode ser negativo."),
  estoque: z.coerce.number().min(0),
  brand_id: z.coerce.number({ message: "Campo obrigatório." }),
  category_id: z.coerce.number({ message: "Campo obrigatório." }),
  unit_id: z.coerce.number({ message: "Campo obrigatório." }),
  supplier_ids: z.array(z.number()).optional().nullable(),
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
  apelido: z.string().optional().nullable().default(null),
  cpf: z.string().optional().nullable().default(null),
  rg: z.string().optional().nullable().default(null),
  data_nascimento: z
    .date({ invalid_type_error: "Data inválida." })
    .optional()
    .nullable()
    .default(null),
  email: z
    .string()
    .email("Email inválido.")
    .optional()
    .nullable()
    .default(null),
  telefone: z.string().optional().nullable().default(null),
  endereco: z.string().optional().nullable().default(null),
  numero: z.string().optional().nullable().default(null),
  complemento: z.string().optional().nullable().default(null),
  bairro: z.string().optional().nullable().default(null),
  cep: z.string().optional().nullable().default(null),
  cidade_id: z.coerce.number().optional().nullable().default(null),
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
  nome: z
    .string()
    .min(3, "O nome é obrigatório.")
    .max(80, "O nome não pode ter mais que 80 caracteres."),
  apelido: z
    .string()
    .max(80, "O apelido não pode ter mais que 80 caracteres.")
    .optional()
    .nullable()
    .default(null),
  data_nascimento: z.date({ invalid_type_error: "Data inválida." }),
  cpf: z
    .string({
      required_error: "Campo obrigatório.",
      invalid_type_error: "O valor deve ser uma string.",
    })
    .transform((val) => val.replace(/[^\d]/g, ""))
    .refine((val) => val.length === 11, {
      message: "O CPF deve ter 11 caracteres.",
    })
    .refine(
      (val) => {
        if (val.length === 11) {
          return validarCPF(val);
        }
        if (val.length === 14) {
          return validarCNPJ(val);
        }
        return false;
      },
      {
        message: "O CPF ou CNPJ informado é inválido.",
      },
    ),
  rg: z
    .string()
    .max(15, "O RG não pode ter mais que 15 caracteres.")
    .optional()
    .nullable()
    .default(null),
  email: z
    .string()
    .email("Email inválido.")
    .max(100, "O email não pode ter mais que 100 caracteres."),
  telefone: z
    .string()
    .min(1, "O telefone é obrigatório.")
    .max(15, "O telefone não pode ter mais que 15 caracteres."),
  endereco: z
    .string()
    .min(1, "O endereço é obrigatório.")
    .max(80, "O endereço não pode ter mais que 80 caracteres."),
  numero: z
    .string()
    .min(1, "O número é obrigatório.")
    .max(6, "O número não pode ter mais que 6 caracteres."),
  complemento: z
    .string()
    .max(80, "O complemento não pode ter mais que 80 caracteres.")
    .optional()
    .nullable()
    .default(null),
  bairro: z
    .string()
    .min(1, "O bairro é obrigatório.")
    .max(80, "O bairro não pode ter mais que 80 caracteres."),
  cidade_id: z.coerce.number().min(1, "A cidade é obrigatória."),
  cep: z
    .string()
    .min(1, "O CEP é obrigatório.")
    .max(9, "O CEP não pode ter mais que 9 caracteres."),
  ativo: z.coerce.boolean().default(true),
  matricula: z
    .string()
    .min(1, "A matrícula é obrigatória.")
    .max(15, "A matrícula não pode ter mais que 15 caracteres."),
  cargo: z
    .string()
    .min(1, "O cargo é obrigatório.")
    .max(50, "O cargo não pode ter mais que 50 caracteres."),
  salario: z.coerce.number().min(0, "O salário não pode ser negativo."),
  data_admissao: z.date({
    required_error: "A data de admissão é obrigatória.",
    invalid_type_error: "Data inválida.",
  }),
  turno: z
    .string()
    .max(20, "O turno não pode ter mais que 20 caracteres.")
    .optional()
    .nullable()
    .default(null),
  carga_horaria: z.coerce
    .number()
    .int()
    .min(0)
    .optional()
    .nullable()
    .default(null),
});

export type EmployeeForm = z.infer<typeof EmployeeSchema>;

export type Client = {
  id: number;
  is_juridica: boolean;
  nome: string;
  apelido: string | null;
  cpf: string;
  rg: string | null;
  data_nascimento: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cep: number | null;
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
  nome: z
    .string({ message: "Campo obrigatório." })
    .min(3, "Nome deve ter mais de 3 caracteres.")
    .max(80, "O nome/razão social não pode ter mais que 80 caracteres."),
  apelido: z
    .string()
    .max(80, "O apelido/nome fantasia não pode ter mais que 80 caracteres.")
    .optional()
    .nullable()
    .default(null),
  cpf: z
    .string({
      required_error: "Campo obrigatório.",
      invalid_type_error: "O valor deve ser uma string.",
    })
    .transform((val) => val.replace(/[^\d]/g, ""))
    .refine((val) => val.length === 11 || val.length === 14, {
      message: "O CPF/CNPJ deve ter 11 ou 14 caracteres.",
    })
    .refine(
      (val) => {
        if (val.length === 11) {
          return validarCPF(val);
        }
        if (val.length === 14) {
          return validarCNPJ(val);
        }
        return false;
      },
      {
        message: "O CPF ou CNPJ informado é inválido.",
      },
    ),
  rg: z
    .string()
    .max(15, "O RG/IE não pode ter mais que 15 caracteres.")
    .optional()
    .nullable()
    .default(null),
  data_nascimento: z.date({
    required_error: "A data de nascimento é obrigatória.",
    invalid_type_error: "Data inválida.",
  }),
  telefone: z
    .string()
    .max(15, "O telefone não pode ter mais que 15 caracteres.")
    .optional()
    .nullable()
    .default(null),
  email: z
    .string()
    .email("Email inválido.")
    .max(100, "O email não pode ter mais que 100 caracteres.")
    .optional()
    .nullable()
    .default(null),
  endereco: z
    .string({ message: "Campo obrigatório." })
    .min(1, "O endereço é obrigatório.")
    .max(80, "O endereço não pode ter mais que 80 caracteres."),
  numero: z
    .string({ message: "Campo obrigatório." })
    .min(1, "O número é obrigatório.")
    .max(6, "O número não pode ter mais que 6 caracteres."),
  bairro: z
    .string({ message: "Campo obrigatório." })
    .min(1, "O bairro é obrigatório.")
    .max(80, "O bairro não pode ter mais que 80 caracteres."),
  cep: z
    .string({ message: "CEP é obrigatório." })
    .min(1, "O CEP é obrigatório.")
    .max(8, "O CEP não pode ter mais que 8 caracteres."),
  limite_credito: z.coerce.number().min(0),
  cidade_id: z.coerce
    .number({ message: "Campo obrigatório." })
    .min(1, "A cidade é obrigatória."),
  cond_pag_id: z.coerce
    .number({ message: "Campo obrigatório." })
    .min(1, "A condição de pagamento é obrigatória."),
  ativo: z.coerce.boolean(),
});

export type ClientForm = z.infer<typeof ClientSchema>;

export const PurchaseItemSchema = z.object({
  id: z.number().optional(),
  product_id: z.coerce
    .number({ required_error: "Selecione um produto." })
    .int()
    .positive(),
  quantidade: z.coerce
    .number({ required_error: "A quantidade é obrigatória." })
    .int()
    .positive("A quantidade deve ser maior que zero."),
  valor_unitario: z.coerce
    .number({ required_error: "O valor unitário é obrigatório." })
    .min(0, "O valor unitário não pode ser negativo."),
});

export const PurchaseInstallmentSchema = z.object({
  id: z.number().optional(),
  numero_parcela: z.coerce.number().int().positive(),
  data_vencimento: z.date({
    required_error: "A data de vencimento é obrigatória.",
  }),
  valor_parcela: z.coerce
    .number()
    .positive("O valor da parcela deve ser maior que zero."),
  data_pagamento: z.date().optional().nullable(),
  valor_pago: z.coerce.number().optional().nullable(),
  observacao: z.string().optional().nullable(),
});

export const PurchaseSchema = z.object({
  id: z.number().optional(),
  modelo: z.string().min(1, "O modelo da nota é obrigatório."),
  serie: z.string().min(1, "A série da nota é obrigatória.").max(3),
  numero_nota: z.string().min(1, "O número da nota é obrigatório.").max(9),
  supplier_id: z.coerce
    .number({ required_error: "Selecione um fornecedor." })
    .int()
    .positive(),
  data_emissao: z.date({ required_error: "A data de emissão é obrigatória." }),
  data_entrega: z.date().optional().nullable(),
  valor_frete: z.coerce.number().min(0).default(0),
  seguro: z.coerce.number().min(0).default(0),
  despesas: z.coerce.number().min(0).default(0),
  payment_condition_id: z.coerce
    .number({ required_error: "Selecione uma condição de pagamento." })
    .int()
    .positive(),
  motivo_cancelamento: z.string().optional().nullable(),
  ativo: z.coerce.boolean().default(true),
  items: z
    .array(PurchaseItemSchema)
    .min(1, "A compra deve ter pelo menos um item."),
  installments: z
    .array(PurchaseInstallmentSchema)
    .min(1, "A compra deve ter pelo menos uma parcela."),
});

export type Purchase = {
  id: number;
  modelo: string;
  serie: string;
  numero_nota: string;
  supplier_id: number;
  data_emissao: string;
  data_entrega: string | null;
  valor_frete: number;
  seguro: number;
  despesas: number;
  payment_condition_id: number;
  motivo_cancelamento: string | null;
  ativo: boolean;
  data_criacao: string;
  data_modificacao: string;

  // Relações
  items: PurchaseItem[];
  installments: PurchaseInstallment[];

  // Campos de JOINs
  supplier_nome?: string;
  payment_condition_descricao?: string;
};

export type PurchaseItem = {
  id: number;
  purchase_id: number;
  product_id: number;
  quantidade: number;
  valor_unitario: number;

  // Campos de JOINs
  product_nome?: string;
};

export type PurchaseInstallment = {
  id: number;
  purchase_id: number;
  numero_parcela: number;
  data_vencimento: string;
  valor_parcela: number;

  data_pagamento: string | null;
  valor_pago: number | null;
  observacao: string | null;

  payment_method_id: number | null;
  valor_multa: number | null;
  valor_juros: number | null;
  valor_desconto: number | null;

  supplier_nome?: string;
  numero_nota?: string;
  purchase_ativo?: boolean;
  payment_method_descricao?: string;

  default_juros_percent?: number | null;
  default_multa?: number | null;
  default_desconto?: number | null;
};

export type ContasPagarStatus =
  | "aberto"
  | "pago"
  | "vencido"
  | "cancelado"
  | "todas";

export type PurchaseForm = z.infer<typeof PurchaseSchema>;


export const SaleItemSchema = z.object({
  product_id: z.coerce.number().min(1, "Selecione um produto."),
  quantidade: z.coerce.number().min(1, "Qtd mínima é 1."),
  valor_unitario: z.coerce.number().min(0.01, "Valor inválido."),
});

export const SaleInstallmentSchema = z.object({
  numero_parcela: z.number(),
  data_vencimento: z.date(),
  valor_parcela: z.number(),
});

export const SaleSchema = z.object({
  id: z.number().optional(),
  client_id: z.coerce.number({ required_error: "Selecione um cliente." }).min(1),
  employee_id: z.coerce.number({ required_error: "Selecione um vendedor." }).min(1),
  payment_condition_id: z.coerce.number({ required_error: "Selecione a condição." }).min(1),
  data_emissao: z.date({ required_error: "Data obrigatória." }),

  modelo: z.string().default("55"),
  serie: z.string().default("1"),
  numero_nota: z.number().optional(),

  items: z.array(SaleItemSchema).min(1, "Adicione pelo menos um produto."),
  installments: z.array(SaleInstallmentSchema).min(1, "Gere as parcelas antes de salvar."),
});

export type SaleForm = z.infer<typeof SaleSchema>;

export type SaleForm = z.infer<typeof SaleSchema>;

export const BaixaContaReceberSchema = z.object({
  id: z.number(),
  valor_parcela: z.number(),
  data_vencimento: z.date(),

  data_pagamento: z.date({
    required_error: "A data do recebimento é obrigatória.",
  }),
  payment_method_id: z.coerce
    .number({
      required_error: "A forma de pagamento é obrigatória.",
    })
    .min(1, "Selecione uma forma de pagamento."),

  valor_multa: z.coerce.number().min(0).default(0),
  valor_juros: z.coerce.number().min(0).default(0),
  valor_desconto: z.coerce.number().min(0).default(0),

  valor_juros_calculado: z.number(),
  valor_pago_calculado: z.number(),

  observacao: z.string().optional().nullable(),
});

export type BaixaContaReceberForm = z.infer<typeof BaixaContaReceberSchema>;

// Tipo para listagem (igual ao PurchaseInstallment mas com dados de venda)
export type SaleInstallmentDTO = {
  id: number;
  sale_id: number;
  numero_parcela: number;
  data_vencimento: string;
  valor_parcela: number;

  data_pagamento: string | null;
  valor_pago: number | null;
  observacao: string | null;

  payment_method_id: number | null;
  valor_multa: number | null;
  valor_juros: number | null;
  valor_desconto: number | null;

  // JOINs
  client_nome?: string;
  sale_id_visual?: number; // ID da venda para exibição
  sale_ativo?: boolean;
  payment_method_descricao?: string;

  // Dados da condição de pagamento original (para cálculo automático na baixa)
  default_juros_percent?: number | null;
  default_multa?: number | null;
  default_desconto?: number | null;
};

export const BaixaParcelaSchema = z.object({
  id: z.number(),
  valor_parcela: z.number(),
  data_vencimento: z.date(),

  data_pagamento: z.date({
    required_error: "A data do pagamento é obrigatória.",
  }),
  payment_method_id: z.coerce
    .number({
      required_error: "A forma de pagamento é obrigatória.",
    })
    .min(1, "Selecione uma forma de pagamento."),

  valor_multa: z.coerce.number().min(0).default(0),
  valor_juros: z.coerce.number().min(0).default(0),
  valor_desconto: z.coerce.number().min(0).default(0),

  valor_juros_calculado: z.number(),
  valor_pago_calculado: z.number(),

  observacao: z.string().optional().nullable(),
});

export type BaixaFormType = z.infer<typeof BaixaParcelaSchema>;

export type PurchaseInstallmentDTO = {
  id: number;
  purchase_id: number;
  numero_parcela: number;
  data_vencimento: string;
  valor_parcela: number;

  data_pagamento: string | null;
  valor_pago: number | null;
  observacao: string | null;
  payment_method_id: number | null;
  valor_multa: number | null;
  valor_juros: number | null;
  valor_desconto: number | null;

  supplier_nome?: string;
  purchase_nota?: string;
  purchase_ativo?: boolean;

  default_juros_percent?: number | null;
  default_multa?: number | null;
  default_desconto?: number | null;
  default_payment_method_id?: number | null;
};
