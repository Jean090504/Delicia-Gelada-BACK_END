/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL na tabela de relacionamento entre categorias e bebidas (tbl_categoria_bebida)
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

const knex = require('knex')
const knexConfig = require('../../database_config_knex/knexFile.js')
const knexConex = knex(knexConfig.development)

// Função para associar uma categoria a uma bebida
async function insertCategoriaBebida(categoriabebida) {
    try {
        let sql = `insert into tbl_categoria_bebida (
                        id_categoria,
                        id_bebida
                    ) values (
                        ${categoriabebida.id_categoria},
                        ${categoriabebida.id_bebida}
                    );`

        let result = await knexConex.raw(sql)
        
        if (result && result[0].insertId)
            return result[0].insertId 
        else
            return false
            
    } catch (error) {
        console.error("Erro SQL no insertCategoriaBebida:", error)
        return false
    }
}

// Função para selecionar todos os relacionamentos cadastrados
async function selectAllCategoriaBebida() {
    try {
        let sql = 'select * from tbl_categoria_bebida order by id desc;' 
        let result = await knexConex.raw(sql)

        if (result && result[0].length > 0) {
            return result[0] 
        } else {
            return false
        }
    } catch (error) {
        console.error("Erro SQL no selectAllCategoriaBebida:", error)
        return false
    }
}

// Função para selecionar um relacionamento específico pelo ID primário
async function selectCategoriaBebidaById(id) {
    try {
        let sql = `select * from tbl_categoria_bebida where id = ${id};`
        let result = await knexConex.raw(sql)

        if (result && result[0].length > 0) {
            return result[0][0] 
        } else {
            return false
        }
    } catch (error) {
        console.error("Erro SQL no selectCategoriaBebidaById:", error)
        return false
    }
}

// Função para selecionar todas as bebidas de uma Categoria específica (Inner Join)
async function selectBebidaByIdCategoria(id_categoria) {
    try {
        let sql = `select tbl_bebida.* from tbl_bebida
                        inner join tbl_categoria_bebida
                            on tbl_bebida.id = tbl_categoria_bebida.id_bebida
                        inner join tbl_categoria
                            on tbl_categoria.id = tbl_categoria_bebida.id_categoria 
                   where tbl_categoria.id = ${id_categoria};`

        let result = await knexConex.raw(sql)

        if (result && result[0].length > 0) {
            return result[0] 
        } else {
            return false
        }
    } catch (error) {
        console.error("Erro SQL no selectBebidaByIdCategoria:", error)
        return false
    }
}

// Função para selecionar todas as categorias de uma Bebida específica (Inner Join)
async function selectCategoriaByIdBebida(id_bebida) {
    try {
        let sql = `select tbl_categoria.* from tbl_categoria
                        inner join tbl_categoria_bebida
                            on tbl_categoria.id = tbl_categoria_bebida.id_categoria
                        inner join tbl_bebida
                            on tbl_bebida.id = tbl_categoria_bebida.id_bebida
                   where tbl_bebida.id = ${id_bebida};`

        let result = await knexConex.raw(sql)

        if (result && result[0].length > 0) {
            return result[0] 
        } else {
            return false
        }
    } catch (error) {
        console.error("Erro SQL no selectCategoriaByIdBebida:", error)
        return false
    }
}

// Função para limpar todas as categorias vinculadas a uma bebida (útil no update de bebidas)
async function deleteCategoriaByIdBebida(idBebida) {
    try {
        let sql = `delete from tbl_categoria_bebida where id_bebida = ?;`
        let result = await knexConex.raw(sql, [idBebida])

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        console.error("Erro SQL no deleteCategoriaByIdBebida:", error)
        return false
    }
}

// Função para deletar uma associação direta pelo ID primário da tabela intermediária
async function deleteCategoriaBebida(id) {
    try {
        let sql = `delete from tbl_categoria_bebida where id = ${id};`
        let result = await knexConex.raw(sql)

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        console.error("Erro SQL no deleteCategoriaBebida:", error)
        return false
    }
}

// Função para atualizar uma associação específica pelo ID primário
async function updateCategoriaBebida(id, categoriabebida) {
    try {
        let sql = `update tbl_categoria_bebida set
                        id_categoria = ${categoriabebida.id_categoria},
                        id_bebida = ${categoriabebida.id_bebida}
                    where id = ${id};` 

        let result = await knexConex.raw(sql)

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        console.error("Erro SQL no updateCategoriaBebida:", error)
        return false
    }
}

module.exports = {
    insertCategoriaBebida,
    selectAllCategoriaBebida,
    selectCategoriaBebidaById,
    selectBebidaByIdCategoria,
    selectCategoriaByIdBebida,
    deleteCategoriaByIdBebida,
    deleteCategoriaBebida,
    updateCategoriaBebida
}