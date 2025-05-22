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
  condicao_id INT NOT NULL,
  numero INT NOT NULL,
  forma_pagamento_id INT NOT NULL,
  valor_porcentagem DECIMAL(5,2) NOT NULL,
  dias_vencimento INT NOT NULL,
  PRIMARY KEY (condicao_id, numero),
  FOREIGN KEY (condicao_id) REFERENCES payment_condition(id)
);


CREATE TABLE country (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sigla CHAR(2) NOT NULL
);

CREATE TABLE state (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  sigla CHAR(2) NOT NULL,
  country_id INT NOT NULL,
  FOREIGN KEY (country_id) REFERENCES country(id)
);

CREATE TABLE city (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  state_id INT NOT NULL,
  FOREIGN KEY (state_id) REFERENCES state(id)
);

CREATE TABLE supplier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  is_juridico BOOLEAN NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  nome VARCHAR(100) NOT NULL,
  apelido VARCHAR(100) NOT NULL,
  cpf VARCHAR(14),
  rg VARCHAR(15),
  data_nascimento DATE,
  email VARCHAR(150),
  telefone VARCHAR(15),
  endereco VARCHAR(120),
  numero INT,
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cep VARCHAR(9),
  cidade_id INT,
  inscricao_estadual_substituto_tributario VARCHAR(30),
  FOREIGN KEY (cidade_id) REFERENCES city(id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  apelido VARCHAR(100) NOT NULL,
  data_nascimento DATE,
  cpf VARCHAR(14),
  rg VARCHAR(15),
  email VARCHAR(150),
  telefone VARCHAR(15),
  endereco VARCHAR(120),
  numero INT,
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade_id INT,
  cep VARCHAR(9),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  matricula VARCHAR(30),
  cargo VARCHAR(100),
  salario DECIMAL(10,2),
  data_admissao DATE,
  turno VARCHAR(30),
  carga_horaria INT,
  FOREIGN KEY (cidade_id) REFERENCES city(id)
);

CREATE TABLE client (
  id INT AUTO_INCREMENT PRIMARY KEY,
  is_juridica BOOLEAN NOT NULL,
  is_ativo BOOLEAN NOT NULL DEFAULT TRUE,
  nome VARCHAR(100) NOT NULL,
  apelido VARCHAR(100) NOT NULL,
  cpf VARCHAR(14),
  rg VARCHAR(15),
  data_nascimento DATE,
  telefone VARCHAR(15),
  email VARCHAR(150),
  endereco VARCHAR(120),
  numero INT,
  bairro VARCHAR(100),
  cep VARCHAR(9),
  limite_credito DECIMAL(10,2),
  cidade_id INT,
  cond_pag_id INT,
  FOREIGN KEY (cidade_id) REFERENCES city(id),
  FOREIGN KEY (cond_pag_id) REFERENCES payment_condition(id)
);
