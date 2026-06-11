/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo controle de dados do projeto Delicia Gelada - CRUD de Usuários
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

//Import do arquivo de padrões de mensagens para manter o código mais organizado e facilitar a manutenção
const config_messages = require('../modelo/configMessages.js')

//Import do arquivo de DAO para manipular os dados no banco de dados
const usuarioDAO = require('../../../model/DAO/usuario/usuario.js') 
const cargoController = require('../cargo/controller_cargo.js')

// Função para validar os dados do usuário
const validarDados = async (usuario) =>{
    let message = JSON.parse(JSON.stringify(config_messages))

    if(usuario.nome == undefined || usuario.nome == "" || usuario.nome == null || usuario.nome.length > 80){
        message.ERROR_BAD_REQUEST.field = "[nome] é obrigatorio e não pode ser vazio"
        return message.ERROR_BAD_REQUEST
    }else if(usuario.email == undefined || usuario.email == "" || usuario.email == null || usuario.email.length > 255){
        message.ERROR_BAD_REQUEST.field = "[email] é obrigatorio e não pode ser vazio"
        return message.ERROR_BAD_REQUEST
    }else if(usuario.senha == undefined || usuario.senha == "" || usuario.senha == null || usuario.senha.length > 512){
        message.ERROR_BAD_REQUEST.field = "[senha] é obrigatorio e não pode ser vazio"
        return message.ERROR_BAD_REQUEST
    
    // CORRIGIDO: Tudo agora verifica apenas id_cargo
    }else if(usuario.id_cargo == undefined || usuario.id_cargo == "" || usuario.id_cargo == null){
        message.ERROR_BAD_REQUEST.field = "[id_cargo] é obrigatorio e não pode ser vazio"
        return message.ERROR_BAD_REQUEST
        
    }else if(usuario.foto == undefined || usuario.foto == "" || usuario.foto == null){
        message.ERROR_BAD_REQUEST.field = "[foto] é obrigatorio e não pode ser vazio"
        return message.ERROR_BAD_REQUEST
    } else {
        // Busca usando id_cargo
        let cargo = await cargoController.buscarCargoById(usuario.id_cargo)

        // SOLUÇÃO: Verificamos primeiro se a variável 'cargo' existe E se o status dela é verdadeiro
        if(!cargo || !cargo.status){
            message.ERROR_BAD_REQUEST.field = "O [id_cargo] informado não existe na base de dados ou ocorreu um erro na busca"
            return message.ERROR_BAD_REQUEST
        } else {
            return false // Retorna false indicando que NÃO há erros (passou na validação!)
        }
    }
}

// Função para inserir um novo usuário
const inserirUsuario = async (usuario, contentType) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try{
        if (String(contentType).toLowerCase() == 'application/json') {
            let validar = await validarDados(usuario)

            if(validar){
                return validar
            } else {
                let result = await usuarioDAO.inserirUsuario(usuario) 

                if(result){
                    usuario.id = result
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = usuario
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }
                return message.DEFAULT_MESSAGE
            }
        }else{
            return message.ERROR_INVALID_CONTENT_TYPE
        }
    }catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para selecionar todos os usuários cadastrados
const listarUsuarios = async () => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let result = await usuarioDAO.listarUsuarios() 

        if(result.length > 0){
                    
            for(let usuario of result){
        
                // ********************
                //        Cargo
                // ********************
        
                let resultCargo = await cargoController.buscarCargoById(usuario.id_cargo)
            
                if(resultCargo.status){
                    
                    let dadosCargo = resultCargo.response[0] || resultCargo.response;
                            
                    usuario.cargo = dadosCargo.nome; 
                            
                    delete usuario.id_cargo; 
                }
            }
                
            message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status 
            message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
            message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
            message.DEFAULT_MESSAGE.response = result
        }
        else {
            return message.ERROR_NOT_FOUND
        }
        return message.DEFAULT_MESSAGE
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para buscar um usuário pelo ID
const buscarUsuarioById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let result = await usuarioDAO.buscarUsuarioById(id) 

        if(result){
            // Se o retorno do DAO for array, pega a posição [0] para não quebrar a lógica abaixo
            let usuario = Array.isArray(result) ? result[0] : result;

            // CORRIGIDO: Busca usando id_cargo
            let resultCargo = await cargoController.buscarCargoById(usuario.id_cargo)

            if(resultCargo.status){
                let dadosCargo = resultCargo.response[0] || resultCargo.response;
                usuario.cargo = dadosCargo.nome; 
                
                // CORRIGIDO: Deleta o id_cargo
                delete usuario.id_cargo; 
            }

            message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status 
            message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
            message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
            message.DEFAULT_MESSAGE.response = usuario
        }
        else {
            return message.ERROR_NOT_FOUND
        }
        return message.DEFAULT_MESSAGE
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para atualizar um usuário pelo ID
const atualizarUsuarioById = async (usuario, id, contentType) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try{
        if (String(contentType).toLowerCase() == 'application/json') {
            let validar = await validarDados(usuario)

            if(validar){
                return validar
            } else {
                let result = await usuarioDAO.updateUsuario(usuario, id) 

                if(result){
                    usuario.id = id
                    
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_UPDATE_ITEM.status 
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_UPDATE_ITEM.message
                    message.DEFAULT_MESSAGE.response = usuario
                }
                else {
                    return message.ERROR_NOT_FOUND
                }
                return message.DEFAULT_MESSAGE
            }
        }else{
            return message.ERROR_INVALID_CONTENT_TYPE
        }
    }catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para deletar um usuário pelo ID
const deletarUsuarioById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        // Primeiro valida se o ID existe antes de deletar, usando a sua função buscarUsuarioById
        let validaBuscaID = await buscarUsuarioById(id)

        if(validaBuscaID && validaBuscaID.status){
            
            let result = await usuarioDAO.deleteUsuario(id) 

            if(result){
                message.DEFAULT_MESSAGE.status = message.SUCCESS_DELETED_ITEM.status 
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_DELETED_ITEM.status_code
                message.DEFAULT_MESSAGE.message = message.SUCCESS_DELETED_ITEM.message
                message.DEFAULT_MESSAGE.response = null
            }
            else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
            return message.DEFAULT_MESSAGE
            
        } else {
             // Retorna a mensagem de ID não encontrado vinda da busca
             return validaBuscaID || message.ERROR_NOT_FOUND_ITEM 
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

module.exports = {
    inserirUsuario,
    listarUsuarios,
    buscarUsuarioById,
    atualizarUsuarioById,
    deletarUsuarioById
}