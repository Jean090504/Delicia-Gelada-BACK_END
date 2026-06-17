/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL na tabela de Categoria
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.2 (Atualizado com o campo 'foto' e proteção contra SQL Injection)
 ********************************************************************************************************************************************/

const knex = require('knex')
const knexConfig = require('../../database_config_knex/knexFile.js')
const knexConex = knex(knexConfig.development)

// Função para inserir dados na tabela de Categoria
async function insertCategoria(categoria){
    try {
        let sql = `INSERT INTO tbl_categoria 
                  (nome, id_status, descricao, foto)
                  VALUES (?, ?, ?, ?);`
        
        let result = await knexConex.raw(sql, [
            categoria.nome, 
            categoria.id_status, 
            categoria.descricao || null, 
            categoria.foto
        ])
    
        if(result)
            return result[0].insertId 
        else
            return false
    }
    catch (error) {
        console.error('Erro ao inserir categoria:', error)
        return false
    }
}

// Função para selecionar todos as categorias cadastradas
async function selectAllCategoria() {
    try{
        let sql = 'SELECT * FROM tbl_categoria ORDER BY id DESC'
        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0] 
        } else {
            return false
        }
    }
    catch (error) {
        console.error('Erro ao selecionar categorias:', error)
        return false
    }
}

// Função para selecionar uma categoria específica pelo ID
async function selectCategoriaById(id) {
    try {
        let sql = `SELECT * FROM tbl_categoria WHERE id = ?`
        let result = await knexConex.raw(sql, [id])

        if(Array.isArray(result) && result[0].length > 0){
            return result[0][0] 
        } else {
            return false
        }

    } catch (error) {
        console.error('Erro ao selecionar categoria por ID:', error)
        return false
    }
}

// Função para deletar uma categoria específica pelo ID
async function deleteCategoria (id) {
    try {
        let sql = `DELETE FROM tbl_categoria WHERE id = ?`
        let result = await knexConex.raw(sql, [id])

        if(result)
            return true
        else
            return false

    } catch (error) {
        console.error('Erro ao deletar categoria:', error)
        return false
    }
}

// Função para atualizar uma categoria 
async function updateCategoria (id, categoria) {
    try {
        let sql = `UPDATE tbl_categoria SET 
                        nome = ?,
                        id_status = ?,
                        descricao = ?,
                        foto = ?
                    WHERE id = ?`

        let result = await knexConex.raw(sql, [
            categoria.nome, 
            categoria.id_status, 
            categoria.descricao || null, 
            categoria.foto, 
            id
        ])

        if(result)
            return true
        else
            return false

    } catch (error) {
        console.error('Erro ao atualizar categoria:', error)
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