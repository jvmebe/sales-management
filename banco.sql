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
  nome VARCHAR(255) NOT NULL,
  apelido VARCHAR(255) NOT NULL,
  cpf VARCHAR(20),
  rg VARCHAR(20),
  data_nascimento DATE,
  email VARCHAR(255),
  telefone VARCHAR(50),
  endereco VARCHAR(255),
  bairro VARCHAR(255),
  cep VARCHAR(20),
  cidade_id INT,
  inscricao_municipal VARCHAR(50),
  inscricao_estadual_substituto_tributario VARCHAR(50),
  FOREIGN KEY (cidade_id) REFERENCES city(id)
);
