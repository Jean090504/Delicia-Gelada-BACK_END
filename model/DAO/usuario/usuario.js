/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD no banco de dados MySQL na tabela de Usuários
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

const bcrypt = require('bcrypt')

// Função para inserir um novo usuário no banco de dados
async function inserirUsuario(dadosUsuario) {
    try {
        const saltRounds = 10
        const hashSenha = await bcrypt.hash(dadosUsuario.senha, saltRounds)

        // Usando dadosUsuario em vez de categoria, e mapeando 'email' para 'email_corporativo'
        let sql = `insert into tbl_usuario (nome, 
                                            email_corporativo,
                                            senha,
                                            foto,
                                            id_cargo)
                                            values ('${dadosUsuario.nome}',
                                            '${dadosUsuario.email}', 
                                            '${hashSenha}', 
                                            '${dadosUsuario.foto}',
                                            ${dadosUsuario.id_cargo});`
                                    
        // Executa o comando SQL no banco de dados
        let result = await knexConex.raw(sql)
    
        if(result)
            return result[0].insertId // Retorna o ID do registro inserido
        else
            return false
    }
    catch (error) {
        console.error('Erro ao inserir usuário:', error) // Textos atualizados para usuário
        return false
    }
}

// Função para selecionar todos os usuários cadastrados (Nome corrigido para bater com o Controller)
async function listarUsuarios() {
    try{
        let sql = 'select * from tbl_usuario order by id desc'

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0] 
        }
        else {
            return false
        }
    }
    catch (error) {
        console.error('Erro ao selecionar usuários:', error)
        return false
    }
}

// Função para selecionar um usuário específico pelo ID (Nome corrigido para bater com o Controller)
async function buscarUsuarioById(id) {
    try {
        let sql = `select * from tbl_usuario where id = ${id}`

        let result = await knexConex.raw(sql)

        if(Array.isArray(result)){
            return result[0] 
        }
        else {
            return false
        }
    }
    catch (error) {
        console.error('Erro ao selecionar usuário por ID:', error)
        return false
    }
}

// Função para atualizar um usuário específico pelo ID
async function updateUsuario(dadosUsuario, id) {
    try {
        const hashSenha = await bcrypt.hash(dadosUsuario.senha, 10)

        let sql = `update tbl_usuario set nome = '${dadosUsuario.nome}',
                                            email_corporativo = '${dadosUsuario.email}',
                                            senha = '${hashSenha}',
                                            foto = '${dadosUsuario.foto}',
                                            id_cargo = ${dadosUsuario.id_cargo}
                    where id = ${id};`

        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false
    }
    catch (error) {
        console.error('Erro ao atualizar usuário:', error)
        return false
    }
}

// Função para deletar um usuário específico pelo ID
async function deleteUsuario(id) {
    try {
        let sql = `delete from tbl_usuario where id = ${id}`

        let result = await knexConex.raw(sql)

        if(result)
            return true
        else
            return false
    }
    catch (error) {
        console.error('Erro ao deletar usuário:', error)
        return false
    }
}

// SQL para retornar apenas email e senha para autenticação do usuário
async function autenticarUsuario(email) {
    try {
        console.log("DAO recebendo e-mail:", email)

        let result = await knexConex('tbl_usuario')
            .select('id', 'email_corporativo', 'senha')
            .where('email_corporativo', email)

            console.log("Resultado bruto do Knex:", result)

        if (result && result.length > 0) {
            return result; // Retorna o array com os dados
        } else {
            return false;
        }
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        return false;
    }
}

// Exportando com os nomes exatamente iguais aos que você usou no Controller!
module.exports = {
    inserirUsuario,
    listarUsuarios,
    buscarUsuarioById,
    updateUsuario,
    deleteUsuario,
    autenticarUsuario
}