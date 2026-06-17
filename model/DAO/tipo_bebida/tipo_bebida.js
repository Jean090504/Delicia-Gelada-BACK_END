/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL na tabela Tipo de Bebida
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.1 (Atualizado com novos campos e proteção contra SQL Injection)
 ********************************************************************************************************************************************/

const knex = require('knex')
const knexConfig = require('../../database_config_knex/knexFile.js')
const knexConex = knex(knexConfig.development)

// Função para inserir dados na tabela de Tipo de Bebida
async function insertTipoBebida(tipoBebida){
    try {
        // Uso de '?' para evitar SQL Injection. O Knex substitui na ordem do array de valores.
        let sql = `INSERT INTO tbl_tipo_bebida 
                  (nome, volume, teor_alcoolico, modo_preparo, ingredientes, perfil_sabor, dica_delicia)
                  VALUES (?, ?, ?, ?, ?, ?, ?);`
        
        let valores = [
            tipoBebida.nome,
            tipoBebida.volume,
            tipoBebida.teor_alcoolico,
            tipoBebida.modo_preparo,
            tipoBebida.ingredientes,
            tipoBebida.perfil_sabor || null, // Se vier vazio, envia NULL (opcional)
            tipoBebida.dica_delicia || null  // Se vier vazio, envia NULL (opcional)
        ]

        let result = await knexConex.raw(sql, valores)

        if(result)
            return result[0].insertId 
        else
            return false

    } catch (error) {
        console.error("Erro no insertTipoBebida:", error)
        return false
    }
}

// Função para selecionar todos os tipos de bebida cadastrados
async function selectAllTipoBebida() {
    try {
        let sql = 'SELECT * FROM tbl_tipo_bebida ORDER BY id DESC;'
        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0] 
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// Função para selecionar um tipo de bebida específico pelo ID
async function selectTipoBebidaById(id) {
    try {
        let sql = `SELECT * FROM tbl_tipo_bebida WHERE id = ?;`
        let result = await knexConex.raw(sql, [id])

        if(Array.isArray(result) && result[0].length > 0){
            return result[0][0] 
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// Função para deletar um tipo de bebida específico pelo ID
async function deleteTipoBebida(id) {
    try {
        let sql = `DELETE FROM tbl_tipo_bebida WHERE id = ?;`
        let result = await knexConex.raw(sql, [id])

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

// Função para atualizar um tipo de bebida
async function updateTipoBebida(id, tipoBebida) {
    try {
        let sql = `UPDATE tbl_tipo_bebida SET 
                   nome = ?, 
                   volume = ?, 
                   teor_alcoolico = ?, 
                   modo_preparo = ?, 
                   ingredientes = ?, 
                   perfil_sabor = ?, 
                   dica_delicia = ? 
                   WHERE id = ?;`
        
        let valores = [
            tipoBebida.nome,
            tipoBebida.volume,
            tipoBebida.teor_alcoolico,
            tipoBebida.modo_preparo,
            tipoBebida.ingredientes,
            tipoBebida.perfil_sabor || null,
            tipoBebida.dica_delicia || null,
            id // O ID vai por último no array para substituir o último '?'
        ]

        let result = await knexConex.raw(sql, valores)

        if(result)
            return true
        else
            return false
    } catch (error) {
        console.error("Erro no updateTipoBebida:", error)
        return false
    }
}

module.exports = {
    insertTipoBebida,
    selectAllTipoBebida,
    selectTipoBebidaById,
    deleteTipoBebida,
    updateTipoBebida
}