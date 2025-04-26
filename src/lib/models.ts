export class PaymentMethod {
    constructor(
      public id: number,
      public descricao: string
    ) {}
  }
  
  export class PaymentInstallment {
    constructor(
      public id: number,
      public condicaoId: number,
      public numero: number,
      public formaPagamentoId: number,
      public valorPorcentagem: number,
      public diasVencimento: number
    ) {}
  }
  
  export class PaymentCondition {
    constructor(
      public id: number,
      public descricao: string,
      public numParcelas: number,
      public installments: PaymentInstallment[] = []
    ) {}
  }
  
  export class Country {
    constructor(
      public id: number,
      public nome: string,
      public sigla: string
    ) {}
  }
  
  export class State {
    constructor(
      public id: number,
      public nome: string,
      public sigla: string,
      public countryId: number
    ) {}
  }
  
  export class City {
    constructor(
      public id: number,
      public nome: string,
      public stateId: number
    ) {}
  }
  
  export class Client {
    constructor(
      public id: number,
      public isJuridico: boolean,
      public isAtivo: boolean,
      public nome: string,
      public apelido: string,
      public cpf: string,
      public rg: string,
      public dataNascimento: Date,
      public telefone: string,
      public email: string,
      public endereco: string,
      public bairro: string,
      public cep: string,
      public cidadeId: number
    ) {}
  }
  
  export class Employee {
    constructor(
      public id: number,
      public nome: string,
      public apelido: string,
      public dataNascimento: Date,
      public cpf: string,
      public rg: string,
      public email: string,
      public telefone: string,
      public endereco: string,
      public bairro: string,
      public cidadeId: number,
      public cep: string,
      public ativo: boolean,
      public matricula: string,
      public cargo: string,
      public salario: number,
      public dataAdmissao: Date,
      public turno: string,
      public cargaHoraria: number
    ) {}
  }
  
  export class Supplier {
    constructor(
      public id: number,
      public isJuridico: boolean,
      public ativo: boolean,
      public nome: string,
      public apelido: string,
      public cpf: string,
      public rg: string,
      public dataNascimento: Date,
      public email: string,
      public telefone: string,
      public endereco: string,
      public bairro: string,
      public cep: string,
      public cidadeId: number,
      public inscricaoMunicipal: string,
      public inscricaoEstadualSubstituto: string
    ) {}
  }
  