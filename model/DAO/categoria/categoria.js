/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL na tabela de Categoria
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.1 (Atualizado com o campo 'descricao' e proteção contra SQL Injection)
 ********************************************************************************************************************************************/

// Importa a biblioteca do Knex para realizar as operações no banco de dados
const knex = require('knex')

// Importa as configurações do Knex para conectar ao banco de dados
const knexConfig = require('../../database_config_knex/knexFile.js')

// Cria uma instância do Knex usando as configurações de desenvolvimento
const knexConex = knex(knexConfig.development)

// Função para inserir dados na tabela de Categoria (Atualizada com 'descricao')
async function insertCategoria(categoria){
    try {
        // Usamos '?' como placeholders para evitar SQL Injection
        let sql = `insert into tbl_categoria (nome, 
                                              id_status, 
                                              descricao)
                                                values (?, ?, ?);`
        
        // Executa o comando passando as variáveis tratadas no segundo argumento
        let result = await knexConex.raw(sql, [categoria.nome, categoria.id_status, categoria.descricao || null])
    
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

// Função para selecionar todos as categorias cadastradas
async function selectAllCategoria() {
    try{
        let sql = 'select * from tbl_categoria order by id desc'
        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0] 
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

// Função para selecionar uma categoria específica pelo ID
async function selectCategoriaById(id) {
    try {
        // Protegendo o ID também com placeholders
        let sql = `select * from tbl_categoria where id = ?`
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
        let sql = `delete from tbl_categoria where id = ?`
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

// Função para atualizar uma categoria (Atualizada com 'descricao')
async function updateCategoria (id, categoria) {
    try {
        // Atualiza nome, id_status e descricao de forma segura
        let sql = `update tbl_categoria set 
                        nome = ?,
                        id_status = ?,
                        descricao = ?
                    where id = ?`

        let result = await knexConex.raw(sql, [categoria.nome, categoria.id_status, categoria.descricao || null, id])

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