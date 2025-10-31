CREATE DATABASE sale_system DEFAULT CHARACTER SET utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci;
USE sale_system;
CREATE TABLE
  country (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    sigla CHAR(2) NOT NULL,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
CREATE TABLE
  state (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    sigla CHAR(2) NOT NULL,
    country_id INT NOT NULL,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (country_id),
    FOREIGN KEY (country_id) REFERENCES country (id)
  );
CREATE TABLE
  city (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    state_id INT NOT NULL,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (state_id),
    FOREIGN KEY (state_id) REFERENCES state (id)
  );
CREATE TABLE
  payment_condition (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL,
    juros DECIMAL(5, 2) DEFAULT 0.00,
    multa DECIMAL(5, 2) DEFAULT 0.00,
    desconto DECIMAL(5, 2) DEFAULT 0.00,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
CREATE TABLE
  payment_method (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
CREATE TABLE
  payment_installment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    condicao_id INT NOT NULL,
    numero_parcela INT NOT NULL,
    dias_vencimento INT NOT NULL,
    percentual_valor DECIMAL(5, 2) NOT NULL,
    forma_pagamento_id INT NOT NULL,
    UNIQUE (condicao_id, numero_parcela),
    INDEX (forma_pagamento_id),
    FOREIGN KEY (condicao_id) REFERENCES payment_condition (id) ON DELETE CASCADE,
    FOREIGN KEY (forma_pagamento_id) REFERENCES payment_method (id)
  );
CREATE TABLE
  client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_juridica TINYINT (1) NOT NULL DEFAULT 0,
    nome VARCHAR(80) NOT NULL,
    apelido VARCHAR(80),
    cpf VARCHAR(14) UNIQUE,
    rg VARCHAR(15) UNIQUE,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    endereco VARCHAR(80) NOT NULL,
    numero VARCHAR(6) NOT NULL,
    bairro VARCHAR(80) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    cidade_id INT NOT NULL,
    cond_pag_id INT NOT NULL,
    limite_credito DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (cidade_id),
    INDEX (cond_pag_id),
    FOREIGN KEY (cidade_id) REFERENCES city (id),
    FOREIGN KEY (cond_pag_id) REFERENCES payment_condition (id)
  );
CREATE TABLE
  employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    apelido VARCHAR(80),
    data_nascimento DATE,
    cpf VARCHAR(14) UNIQUE,
    rg VARCHAR(15),
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    endereco VARCHAR(80) NOT NULL,
    numero VARCHAR(6) NOT NULL,
    complemento VARCHAR(80) NULL,
    bairro VARCHAR(80) NOT NULL,
    cidade_id INT NOT NULL,
    cep VARCHAR(9) NOT NULL,
    matricula VARCHAR(15) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    salario DECIMAL(10, 2) NOT NULL,
    data_admissao DATE NOT NULL,
    turno VARCHAR(20) NULL,
    carga_horaria INT NULL,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (cidade_id),
    FOREIGN KEY (cidade_id) REFERENCES city (id)
  );
CREATE TABLE
  product_unit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    sigla VARCHAR(10) NOT NULL,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
CREATE TABLE
  product_brand (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
CREATE TABLE
  product_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    descricao TEXT,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
CREATE TABLE
  product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    descricao TEXT,
    codigo_barras VARCHAR(20) UNIQUE,
    valor_compra DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    valor_venda DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    estoque INT NOT NULL DEFAULT 0,
    brand_id INT,
    category_id INT,
    unit_id INT NOT NULL,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (brand_id),
    INDEX (category_id),
    INDEX (unit_id),
    FOREIGN KEY (brand_id) REFERENCES product_brand (id),
    FOREIGN KEY (category_id) REFERENCES product_category (id),
    FOREIGN KEY (unit_id) REFERENCES product_unit (id)
  );
CREATE TABLE
  supplier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_juridica TINYINT (1) NOT NULL DEFAULT 0,
    nome VARCHAR(80) NOT NULL,
    apelido VARCHAR(80),
    cpf VARCHAR(14) UNIQUE,
    rg VARCHAR(15) UNIQUE,
    data_nascimento DATE,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    endereco VARCHAR(80) NOT NULL,
    numero VARCHAR(6) NOT NULL,
    complemento VARCHAR(80) NULL,
    bairro VARCHAR(80) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    cidade_id INT,
    payment_condition_id INT,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (cidade_id),
    INDEX (payment_condition_id),
    FOREIGN KEY (cidade_id) REFERENCES city (id),
    FOREIGN KEY (payment_condition_id) REFERENCES payment_condition (id)
  );

CREATE TABLE
  transportadora (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_juridico TINYINT (1) NOT NULL DEFAULT 0,
    nome VARCHAR(100) NOT NULL,
    apelido VARCHAR(100),
    cpf VARCHAR(14) UNIQUE,
    rg VARCHAR(15),
    data_nascimento DATE,
    email VARCHAR(150),
    telefone VARCHAR(15),
    endereco VARCHAR(120),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cep VARCHAR(9),
    cidade_id INT,
    ativo TINYINT (1) NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (cidade_id),
    FOREIGN KEY (cidade_id) REFERENCES city (id)
  );
CREATE TABLE
  product_supplier (
    product_id INT NOT NULL,
    supplier_id INT NOT NULL,
    PRIMARY KEY (product_id, supplier_id),
    FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES supplier (id) ON DELETE CASCADE
  );

CREATE TABLE IF NOT EXISTS purchase (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(50) NOT NULL,
    serie VARCHAR(3) NOT NULL,
    numero_nota VARCHAR(9) NOT NULL,
    supplier_id INT NOT NULL,
    data_emissao DATE NOT NULL,
    data_entrega DATE NULL,
    valor_frete DECIMAL(10,2) NOT NULL DEFAULT 0,
    seguro DECIMAL(10,2) NOT NULL DEFAULT 0,
    despesas DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_condition_id INT NOT NULL,
    motivo_cancelamento VARCHAR(255) NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_purchase_nota (modelo, serie, numero_nota),
    CONSTRAINT fk_purchase_supplier FOREIGN KEY (supplier_id) REFERENCES supplier(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_purchase_payment_condition FOREIGN KEY (payment_condition_id) REFERENCES payment_condition(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS purchase_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    product_id INT NOT NULL,
    quantidade INT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    valor_compra_anterior DECIMAL(10,2) NOT NULL, -- Coluna para armazenar o custo antigo
    estoque_anterior INT NOT NULL,             -- Coluna para armazenar o estoque antigo
    UNIQUE KEY uq_purchase_item_product (purchase_id, product_id),
    CONSTRAINT fk_purchase_item_purchase FOREIGN KEY (purchase_id) REFERENCES purchase(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_purchase_item_product FOREIGN KEY (product_id) REFERENCES product(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS purchase_installment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    numero_parcela INT NOT NULL,
    data_vencimento DATE NOT NULL,
    valor_parcela DECIMAL(10,2) NOT NULL,

    data_pagamento DATE NULL,
    valor_pago DECIMAL(10,2) NULL DEFAULT 0,
    observacao VARCHAR(255) NULL,

    payment_method_id INT NULL,
    valor_multa DECIMAL(10,2) NULL DEFAULT 0,
    valor_juros DECIMAL(10,2) NULL DEFAULT 0,
    valor_desconto DECIMAL(10,2) NULL DEFAULT 0,

    UNIQUE KEY uq_purchase_installment_parcela (purchase_id, numero_parcela),
    CONSTRAINT fk_purchase_installment_purchase FOREIGN KEY (purchase_id) REFERENCES purchase(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_purchase_installment_payment_method FOREIGN KEY (payment_method_id) REFERENCES payment_method(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);
