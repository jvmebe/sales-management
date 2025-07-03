CREATE DATABASE sale_system DEFAULT CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci;

USE sale_system;

CREATE TABLE
    country (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        sigla CHAR(2) NOT NULL,
        ativo TINYINT (1) NOT NULL DEFAULT 1,
        data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
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
    )
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
    )
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
    )
CREATE TABLE
    payment_method (
        id INT AUTO_INCREMENT PRIMARY KEY,
        descricao VARCHAR(50) NOT NULL,
        ativo TINYINT (1) NOT NULL DEFAULT 1,
        data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
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
    )
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
    )
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
    )
CREATE TABLE
    product_unit (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(80) NOT NULL,
        sigla VARCHAR(10) NOT NULL,
        ativo TINYINT (1) NOT NULL DEFAULT 1,
        data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
CREATE TABLE
    product_brand (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(80) NOT NULL,
        ativo TINYINT (1) NOT NULL DEFAULT 1,
        data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
CREATE TABLE
    product_category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(80) NOT NULL,
        descricao TEXT,
        ativo TINYINT (1) NOT NULL DEFAULT 1,
        data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
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
        supplier_id INT,
        ativo TINYINT (1) NOT NULL DEFAULT 1,
        data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (brand_id),
        INDEX (category_id),
        INDEX (unit_id),
        INDEX (supplier_id),
        FOREIGN KEY (brand_id) REFERENCES product_brand (id),
        FOREIGN KEY (category_id) REFERENCES product_category (id),
        FOREIGN KEY (unit_id) REFERENCES product_unit (id),
        FOREIGN KEY (supplier_id) REFERENCES supplier (id)
    )
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
        ativo TINYINT (1) NOT NULL DEFAULT 1,
        data_criacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        data_modificacao TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (cidade_id),
        FOREIGN KEY (cidade_id) REFERENCES city (id)
    )
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
    )