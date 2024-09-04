CREATE DATABASE IF NOT EXISTS pdv;

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY, 
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL
);

INSERT INTO categorias (descricao) VALUES
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livro e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    quantidade_estoque INTEGER NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id),
    produto_imagem TEXT
);

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    cep VARCHAR(9),
    rua TEXT,
    numero VARCHAR(10) ,
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(50) 
);

CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    observacao TEXT,
    valor_total DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido_produtos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id),
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    quantidade_produto INTEGER NOT NULL,
    valor_produto DECIMAL(10, 2) NOT NULL
);
