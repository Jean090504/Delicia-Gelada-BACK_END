/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL na tabela Status
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

// Função para inserir dados na tabela de Status
async function insertStatus(status){
    try {
        let sql = `insert into tbl_status (nome)
                            values ('${status.nome}');`

        // Executa o comando SQL no banco de dados
        let result = await knexConex.raw(sql)

        if(result)
            return result[0].insertId // Retorna o ID do registro inserido
        else
            return false
    }
    catch (error) {
        return false
    }
}

// Função para selecionar todos os status cadastrados
async function selectAllStatus() {
    try{
        //Script SQL para selecionar todos os dados da tabela status ordenados pelo ID de forma decrescente
        let sql = 'select * from tbl_status order by id desc'

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
        console.error('Erro ao selecionar status:', error)
        return false
    }
}

// Função para selecionar um status específico pelo ID
async function selectStatusById(id) {
    try {
        //Script SQL para selecionar um registro específico da tabela status pelo ID
        let sql = `select * from tbl_status where id = ${id}`

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

// Função para deletar um status específico pelo ID
async function deleteStatus (id) {
    try {
        //Script SQL para deletar um registro específico da tabela status pelo ID
        let sql = `delete from tbl_status where id = ${id}`

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

// Função para atualizar um status
async function updateStatus (id, status) {
    try {
        //Script SQL para atualizar um registro específico da tabela status pelo ID
        let sql = `update tbl_status set nome = '${status.nome}' where id = ${id}`

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
    insertStatus,
    selectAllStatus,
    selectStatusById,
    deleteStatus,
    updateStatus
}