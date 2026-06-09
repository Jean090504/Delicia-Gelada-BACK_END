/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL na tabela de Categoria
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

// Importa a biblioteca do Knex para realizar as operações no banco de dados
const knex = require('knex')

// Importa as configurações do Knex para conectar ao banco de dados
const knexConfig = require('../../database_config_knex/knexFile.js')

// Cria uma instância do Knex usando as configurações de desenvolvimento
const knexConex = knex(knexConfig.development)

// Função para inserir dados na tabela de Categoria
async function insertCategoria(categoria){
    try {
        let sql = `insert into tbl_categoria (nome, id_status)
                            values ('${categoria.nome}', ${categoria.id_status});`
        // Executa o comando SQL no banco de dados
        let result = await knexConex.raw(sql)
    
        if(result)
            return result[0].insertId // Retorna o ID do registro inserido
        else
            return false
    }
    catch (error) {
        console.error('Erro ao inserir categoria:', error)
        return false
    }
}

// Função para selecionar todos os categorias cadastrados
async function selectAllCategoria() {
    try{
        //Script SQL para selecionar todos os dados da tabela categoria ordenados pelo ID de forma decrescente
        let sql = 'select * from tbl_categoria order by id desc'

        // Executa o comando SQL no banco de dados e retorna o resultado da consulta
        let result = await knexConex.raw(sql)

        //Validação para verificar se o Banco de Dados é um array
        //Se o script der errado ou não houver registros, o resultado não será um array, e a função retornará false
        if(Array.isArray(result)){
            return result[0] // Retorna apenas o array de dados, ignorando os metadados
        }
        else {
            return false
        }
    }
    catch (error) {
        console.error('Erro ao selecionar categorias:', error)
        return false
    }
}

// Função para selecionar todos um categoria específico pelo ID
async function selectCategoriaById(id) {
    try {
        //Script SQL para selecionar um registro específico da tabela categoria pelo ID
        let sql = `select * from tbl_categoria where id = ${id}`

        // Executa o comando SQL no banco de dados e retorna o resultado da consulta
        let result = await knexConex.raw(sql)

        //Validação para verificar se o Banco de Dados é um array
        //Se o script der errado ou não houver registros, o resultado não será um array, e a função retornará false
        if(Array.isArray(result)){
            return result[0][0] // Retorna apenas o primeiro registro encontrado, ignorando os metadados
        } else {
            return false
        }

    } catch (error) {
        return false
    }
    
}

// Função para deletar um categoria específico pelo ID
async function deleteCategoria (id) {
    try {
        //Script SQL para deletar um registro específico da tabela categoria pelo ID
        let sql = `delete from tbl_categoria where id = ${id}`

        // Executa o comando SQL no banco de dados e retorna o resultado da consulta
        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

// Função para atualizar um categoria
async function updateCategoria (id, categoria) {
    try {
        //Script SQL para atualizar um registro específico da tabela categoria pelo ID
        let sql = `update tbl_categoria set nome = '${categoria.nome}',
                                            id_status = ${categoria.id_status}
                                            where id = ${id}`

        // Executa o comando SQL no banco de dados e retorna o resultado da consulta
        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    insertCategoria,
    selectAllCategoria,
    selectCategoriaById,
    deleteCategoria,
    updateCategoria
}