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
