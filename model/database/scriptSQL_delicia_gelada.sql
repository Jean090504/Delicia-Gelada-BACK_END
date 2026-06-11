create database db_delicia_gelada;
use db_delicia_gelada;

 create table tbl_status(
	id	int not null primary key auto_increment,
    nome varchar(20) not null
 );
 
  create table tbl_cargo(
	id	int not null primary key auto_increment,
    nome varchar(45) not null
 );
 
   create table tbl_tipo_bebida(
	id	int not null primary key auto_increment,
    nome varchar(45) not null
 );
 
    create table tbl_categoria(
	id	int not null primary key auto_increment,
    nome varchar(50) not null,
    id_status int not null,
    
    constraint FK_STATUS_CATEGORIA
    foreign key (id_status)
    references tbl_status(id)
 );
 
 
    create table tbl_usuario(
	id	int not null primary key auto_increment,
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
	id	int not null primary key auto_increment,
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
 
CREATE VIEW vw_bebidas_nao_alcoolicas AS
SELECT bebida.* FROM tbl_bebida AS bebida
INNER JOIN tbl_categoria_bebida AS categoria_bebida ON bebida.id = categoria_bebida.id_bebida
INNER JOIN tbl_categoria AS categoria ON categoria_bebida.id_categoria = categoria.id
WHERE categoria.nome = 'NÃO ALCOÓLICO';

select * from vw_bebidas_nao_alcoolicas;
select * from tbl_bebida;

SELECT email_corporativo FROM tbl_usuario;

select  * from tbl_usuario;
