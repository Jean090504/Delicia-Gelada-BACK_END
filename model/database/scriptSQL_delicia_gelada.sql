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
    senha varchar(20) not null,
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
 
 
 