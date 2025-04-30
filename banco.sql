CREATE TABLE payment_method (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL
);


CREATE TABLE payment_condition (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  num_parcelas INT NOT NULL
);


CREATE TABLE payment_installment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  condicao_id INT NOT NULL,
  numero INT NOT NULL,
  forma_pagamento_id INT NOT NULL,
  valor_porcentagem DECIMAL(5,2) NOT NULL,
  dias_vencimento INT NOT NULL,
  FOREIGN KEY (condicao_id) REFERENCES payment_condition(id)
);

CREATE TABLE country (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  sigla CHAR(2) NOT NULL
);

CREATE TABLE state (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  sigla CHAR(2) NOT NULL,
  country_id INT NOT NULL,
  FOREIGN KEY (country_id) REFERENCES country(id)
);

CREATE TABLE city (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  state_id INT NOT NULL,
  FOREIGN KEY (state_id) REFERENCES state(id)
);

CREATE TABLE supplier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  is_juridico BOOLEAN NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  nome VARCHAR(100) NOT NULL,
  apelido VARCHAR(100) NOT NULL,
  cpf VARCHAR(11),
  rg VARCHAR(10),
  data_nascimento DATE,
  email VARCHAR(100),
  telefone VARCHAR(11),
  endereco VARCHAR(100),
  numero INT,
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cep VARCHAR(8),
  cidade_id INT,
  inscricao_estadual_substituto_tributario VARCHAR(50),
  FOREIGN KEY (cidade_id) REFERENCES city(id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  apelido VARCHAR(255) NOT NULL,
  data_nascimento DATE,
  cpf VARCHAR(20),
  rg VARCHAR(20),
  email VARCHAR(255),
  telefone VARCHAR(50),
  endereco VARCHAR(255),
  bairro VARCHAR(255),
  cidade_id INT,
  cep VARCHAR(20),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  matricula VARCHAR(50),
  cargo VARCHAR(255),
  salario DECIMAL(10,2),
  data_admissao DATE,
  turno VARCHAR(50),
  carga_horaria INT,
  FOREIGN KEY (cidade_id) REFERENCES city(id)
);


CREATE TABLE client (
  id INT AUTO_INCREMENT PRIMARY KEY,
  is_juridica BOOLEAN NOT NULL,    -- TRUE para pessoa jurídica, FALSE para pessoa física
  is_ativo BOOLEAN NOT NULL DEFAULT TRUE,
  nome VARCHAR(100) NOT NULL,
  apelido VARCHAR(100) NOT NULL,
  cpf VARCHAR(11),                 -- CPF ou CNPJ, conforme o caso
  rg VARCHAR(10),                  -- RG ou Inscrição Estadual
  data_nascimento DATE,            -- Data de Nascimento ou Data de Fundação
  telefone VARCHAR(11),
  email VARCHAR(100),
  endereco VARCHAR(100),
  numero INT,
  bairro VARCHAR(100),
  cep VARCHAR(8),
  limite_credito DECIMAL(10,2),
  cidade_id INT,
  cond_pag_id INT,
  FOREIGN KEY (cidade_id) REFERENCES city(id),
  FOREIGN KEY (cond_pag_id) REFERENCES payment_condition(id)
);
