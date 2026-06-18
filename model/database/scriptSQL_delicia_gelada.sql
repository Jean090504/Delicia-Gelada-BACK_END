create database db_delicia_gelada;
use db_delicia_gelada;

-- 1. CRIAÇÃO DAS TABELAS SEM CHAVE ESTRANGEIRA
create table tbl_status(
    id int not null primary key auto_increment,
    nome varchar(20) not null
);

create table tbl_cargo(
    id int not null primary key auto_increment,
    nome varchar(45) not null
);

create table tbl_tipo_bebida(
    id int not null primary key auto_increment,
    nome varchar(45) not null,
    volume VARCHAR(10) NOT NULL,     
    teor_alcoolico VARCHAR(10) NOT NULL,
    modo_preparo TEXT NOT NULL,         
    ingredientes TEXT NOT NULL, 
    perfil_sabor VARCHAR(50),          
    dica_delicia VARCHAR(255)
);

-- 2. CRIAÇÃO DAS TABELAS COM CHAVE ESTRANGEIRA
create table tbl_categoria(
    id int not null primary key auto_increment,
    nome varchar(50) not null,
    descricao varchar(255) null,
    foto varchar(255) not null,
    id_status int not null,
    
    constraint FK_STATUS_CATEGORIA
    foreign key (id_status)
    references tbl_status(id)
);

create table tbl_usuario(
    id int not null primary key auto_increment,
    nome varchar(80) not null,
    email_corporativo varchar(255) not null,
    senha varchar(512) not null,
    foto varchar(255) not null,
    id_cargo int not null,
    
    constraint FK_CARGO_USUARIO
    foreign key (id_cargo)
    references tbl_cargo(id)
);

create table tbl_bebida(
    id int not null primary key auto_increment,
    nome varchar(80) not null,
    descricao text not null,
    preco decimal(5,2) not null,
    imagem varchar(255) not null,
    id_tipo_bebida int not null,
    id_usuario int not null,
    id_status int not null,
    
    constraint FK_TIPOBEBIDA_BEBIDA
    foreign key (id_tipo_bebida)
    references tbl_tipo_bebida(id),
    
    constraint FK_USUARIO_BEBIDA
    foreign key (id_usuario)
    references tbl_usuario(id),
    
    constraint FK_STATUS_BEBIDA
    foreign key (id_status)
    references tbl_status(id)    
);

create table tbl_categoria_bebida(
    id int not null primary key auto_increment,
    id_categoria int not null,
    id_bebida int not null,
    
    constraint FK_CATEGORIA_CATEGORIABEBIDA
    foreign key (id_categoria)
    references tbl_categoria(id),
    
    constraint FK_BEBIDA_CATEGORIABEBIDA
    foreign key (id_bebida)
    references tbl_bebida(id)
);

-- 3. INSERÇÃO DE DADOS (Corrigidos)
insert into tbl_status (nome) values ('inativo'), ('ativo');

insert into tbl_cargo (nome) values ('Admin'), ('Repositor'), ('Atendente'), ('Gerente');

-- Adicionei uma URL de imagem genérica para não quebrar a quantidade de colunas
insert into tbl_usuario (nome, email_corporativo, senha, foto, id_cargo) 
values ('Jean Costa', 'jean.costa@deliciagelada.com', '$2b$10$hQmNc4OF.u3fUvxGaTc3XeUe4tC6nTt8SSPU3cUPTkq8tXTBbHgVa', 'https://uploadsimageproject.blob.core.windows.net/uploadsimageproject/1781780375051_jean.png', 1);

insert into tbl_usuario (nome, email_corporativo, senha, foto, id_cargo) 
values ('Anderson Ribeiro', 'anderson.ribeiro@deliciagelada.com', '$2b$10$QbSK3FIiUGms5hEMvQHXEOw.3.i0zywtWx1BSuHWyS.wLI3Ni/tOi', 'https://uploadsimageproject.blob.core.windows.net/uploadsimageproject/1781780908462_anderson.png', 3);

insert into tbl_usuario (nome, email_corporativo, senha, foto, id_cargo) 
values ('Daniele Silva', 'daniele.silva@deliciagelada.com', '$2b$10$Luwo0d0BcN.Ps4jE2iV8neqtUDIfmLQ2ELrpElE0.Hf7UzXGGXw4C', 'https://uploadsimageproject.blob.core.windows.net/uploadsimageproject/1781780958615_daniele.png', 2);

insert into tbl_usuario (nome, email_corporativo, senha, foto, id_cargo) 
values ('Diego de Padua', 'diego.padua@deliciagelada.com', '$2b$10$.6kPURZGp41GFwk0bW8W1.weQJG9eiA.dikOFJT2NQtkrl5J9iFc2', 'https://uploadsimageproject.blob.core.windows.net/uploadsimageproject/1781781028287_diego.png', 2);

insert into tbl_usuario (nome, email_corporativo, senha, foto, id_cargo) 
values ('Mayara Andrade', 'mayara.andrade@deliciagelada.com', '$2b$10$11B/fQMXGHXhzUNetaF5dOP9rsB88Qj3gY6IXknnNgByu4g5R/3J2', 'https://uploadsimageproject.blob.core.windows.net/uploadsimageproject/1781781069438_may.png', 4);

select * from tbl_categoria_bebida;

CREATE OR REPLACE VIEW view_detalhes_bebida AS
SELECT 
    tbl_bebida.id,
    tbl_bebida.nome,
    tbl_bebida.descricao,
    tbl_bebida.preco,
    tbl_bebida.imagem,
    tbl_tipo_bebida.volume AS volume_em_mililitros, 
    tbl_tipo_bebida.teor_alcoolico AS porcentagem_de_teor_alcoolico, 
    tbl_tipo_bebida.perfil_sabor AS perfil_de_sabor_da_bebida
FROM tbl_bebida 
INNER JOIN tbl_tipo_bebida ON tbl_bebida.id_tipo_bebida = tbl_tipo_bebida.id;

-- 4. TRIGGERS
DELIMITER $$

CREATE TRIGGER tg_validar_bebida
BEFORE INSERT
ON tbl_bebida
FOR EACH ROW
BEGIN
    IF NEW.nome IS NULL OR NEW.nome = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'O nome da bebida é obrigatório';
    END IF;

    IF NEW.preco <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'O preço deve ser maior que zero';
    END IF;
END$$

DELIMITER ;

-- 5. VALIDAÇÃO FINAL (Esses selects agora vão funcionar!)
show tables;
select * from tbl_cargo;
select * from tbl_tipo_bebida;
select * from tbl_usuario;
select * from tbl_status;
select * from tbl_categoria;
select * from tbl_bebida; 
 
CREATE VIEW vw_bebidas_nao_alcoolicas AS
SELECT bebida.* FROM tbl_bebida AS bebida
INNER JOIN tbl_categoria_bebida AS categoria_bebida ON bebida.id = categoria_bebida.id_bebida
INNER JOIN tbl_categoria AS categoria ON categoria_bebida.id_categoria = categoria.id
WHERE categoria.nome = 'NÃO ALCOÓLICO';


-- Views
#Ela serve para a área administrativa, porque mostra detalhes da bebida.
CREATE VIEW vw_bebidas_completas AS
SELECT
    tbl_bebida.nome AS nome_bebida,

    GROUP_CONCAT(tbl_categoria.nome SEPARATOR ', ') AS categoria,

    tbl_tipo_bebida.nome AS tipo,

    tbl_bebida.preco,

    tbl_usuario.nome AS usuario_cadastro,

    tbl_status.nome AS status_bebida

FROM tbl_bebida

INNER JOIN tbl_tipo_bebida
    ON tbl_bebida.id_tipo_bebida = tbl_tipo_bebida.id

INNER JOIN tbl_usuario
    ON tbl_bebida.id_usuario = tbl_usuario.id

INNER JOIN tbl_status
    ON tbl_bebida.id_status = tbl_status.id

LEFT JOIN tbl_categoria_bebida
    ON tbl_bebida.id = tbl_categoria_bebida.id_bebida

LEFT JOIN tbl_categoria
    ON tbl_categoria_bebida.id_categoria = tbl_categoria.id

GROUP BY
    tbl_bebida.id,
    tbl_bebida.nome,
    tbl_tipo_bebida.nome,
    tbl_bebida.preco,
    tbl_usuario.nome,
    tbl_status.nome;
    
    
#Ela serve para a landing page, ou seja, a parte que o cliente vê.
#O cliente não precisa ver bebida inativa ou escondida.
CREATE VIEW vw_bebidas_ativas AS
SELECT *
FROM vw_bebidas_completas
WHERE status_bebida = 'Ativo';
    
#Ela serve para mostrar filtros ou menus no site. 
#Se uma categoria estiver inativa, ela não aparece para o cliente.   
CREATE VIEW vw_categorias_ativas AS
SELECT
    tbl_categoria.id,
    tbl_categoria.nome
FROM tbl_categoria
INNER JOIN tbl_status
    ON tbl_categoria.id_status = tbl_status.id
WHERE tbl_status.nome = 'Ativo';   



select * from vw_bebidas_completas;   
select * from vw_bebidas_completas;
 


#A Procedure centraliza a consulta das bebidas. Ao executar a CALL
#sp_listar_bebidas() , o sistema retorna todas as informações da View sem precisar
#reescrever a consulta SQL
CREATE PROCEDURE sp_listar_bebidas()

BEGIN

	SELECT *
    FROM vw_bebidas_completas;
    
END$$

DELIMITER ;

CALL sp_listar_bebidas();





DELIMITER $$



-- Criação da Function responsável por calcular
-- o preço médio de todas as bebidas cadastradas
CREATE FUNCTION fn_preco_medio_bebidas()

-- A Function retornará um valor decimal
RETURNS DECIMAL(5,2)

-- Informa ao banco que, para os mesmos dados,
-- a Function sempre retornará o mesmo resultado
DETERMINISTIC

BEGIN

    -- Variável que armazenará o resultado da média
    DECLARE media_preco DECIMAL(5,2);

    -- Calcula a média dos preços da tabela tbl_bebida
    -- e armazena o resultado na variável media_preco
    SELECT AVG(preco)
    INTO media_preco
    FROM tbl_bebida;

    -- Retorna o valor calculado para quem chamou a Function
    RETURN media_preco;

END$$

DELIMITER ;

SELECT fn_total_bebidas_ativas();