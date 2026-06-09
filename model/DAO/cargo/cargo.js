/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL na tabela Cargo
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

// Função para inserir dados na tabela de Cargo
async function insertCargo(cargo){
    try {
        let sql = `insert into tbl_cargo (nome)
                            values ('${cargo.nome}');`

        // Executa o comando SQL no banco de dados
        let result = await knexConex.raw(sql)

        if(result)
            return result[0].insertId // Retorna o ID do registro inserido
        else
            return false

    } catch (error) {
        return false
    }
}

// Função para selecionar todos os cargos cadastrados
async function selectAllCargo() {
    try {
        //Script SQL para selecionar todos os dados da tabela cargo ordenados pelo ID de forma decrescente
        let sql = 'select * from tbl_cargo order by id desc'

        // Executa o comando SQL no banco de dados e retorna o resultado da consulta
        let result = await knexConex.raw(sql)

        //Validação para verificar se o Banco de Dados é um array
        //Se o script der errado ou não houver registros, o resultado não será um array, e a função retornará false
        if(Array.isArray(result)){
            return result[0] // Retorna apenas o array de dados, ignorando os metadados
        } else {
            return false
        }

    } catch (error) {
        return false
    }
    
}

// Função para selecionar um cargo específico pelo ID
async function selectCargoById(id) {
    try {
        //Script SQL para selecionar um registro específico da tabela cargo pelo ID
        let sql = `select * from tbl_cargo where id = ${id}`

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

// Função para deletar um cargo específico pelo ID
async function deleteCargo (id) {
    try {
        //Script SQL para deletar um registro específico da tabela cargo pelo ID
        let sql = `delete from tbl_cargo where id = ${id}`

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

// Função para atualizar um cargo
async function updateCargo (id, cargo) {
    try {
        //Script SQL para atualizar um registro específico da tabela cargo pelo ID
        let sql = `update tbl_cargo set nome = '${cargo.nome}' where id = ${id}`

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
    insertCargo,
    selectAllCargo,
    selectCargoById,
    deleteCargo,
    updateCargo
}