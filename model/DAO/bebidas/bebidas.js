/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL na tabela de Bebidas
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

const knex = require('knex')
const knexConfig = require('../../database_config_knex/knexFile.js')
const knexConex = knex(knexConfig.development)

// Função para inserir uma nova bebida
async function inserirBebida(dadosBebida) {
    try {
        let sql = `insert into tbl_bebida (nome, 
                                           descricao, 
                                           preco, 
                                           imagem, 
                                           id_tipo_bebida, 
                                           id_usuario, 
                                           id_status)
                            values ('${dadosBebida.nome}',
                                    '${dadosBebida.descricao}', 
                                     ${dadosBebida.preco}, 
                                    '${dadosBebida.imagem}',
                                     ${dadosBebida.id_tipo_bebida},
                                     ${dadosBebida.id_usuario},
                                     ${dadosBebida.id_status});`
                                    
        let result = await knexConex.raw(sql)
    
        if(result) return result[0].insertId 
        else return false
    } catch (error) {
        console.error('Erro ao inserir bebida:', error) 
        return false
    }
}

// Função para listar todas as bebidas
async function listarBebidas() {
    try {
        let sql = 'select * from tbl_bebida order by id desc'
        let result = await knexConex.raw(sql)

        if(Array.isArray(result)) return result[0] 
        else return false
    } catch (error) {
        console.error('Erro ao selecionar bebidas:', error)
        return false
    }
}

// Função para buscar bebida por ID
async function buscarBebidaById(id) {
    try {
        let sql = `select * from tbl_bebida where id = ${id}`
        let result = await knexConex.raw(sql)

        if(Array.isArray(result)) return result[0] 
        else return false
    } catch (error) {
        console.error('Erro ao selecionar bebida por ID:', error)
        return false
    }
}

// Função para atualizar bebida
async function updateBebida(dadosBebida, id) {
    try {
        let sql = `update tbl_bebida set nome = '${dadosBebida.nome}',
                                         descricao = '${dadosBebida.descricao}',
                                         preco = ${dadosBebida.preco},
                                         imagem = '${dadosBebida.imagem}',
                                         id_tipo_bebida = ${dadosBebida.id_tipo_bebida},
                                         id_usuario = ${dadosBebida.id_usuario},
                                         id_status = ${dadosBebida.id_status}
                                     where id = ${id};`

        let result = await knexConex.raw(sql)

        if(result) return true
        else return false
    } catch (error) {
        console.error('Erro ao atualizar bebida:', error)
        return false
    }
}

// Função para deletar bebida
async function deleteBebida(id) {
    try {
        let sql = `delete from tbl_bebida where id = ${id}`
        let result = await knexConex.raw(sql)

        if(result) return true
        else return false
    } catch (error) {
        console.error('Erro ao deletar bebida:', error)
        return false
    }
}

module.exports = {
    inserirBebida,
    listarBebidas,
    buscarBebidaById,
    updateBebida,
    deleteBebida
}