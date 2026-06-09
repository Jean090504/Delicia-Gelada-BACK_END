/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo controle de dados do projeto Delicia Gelada - CRUD do Status
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

//Import do arquivo de padrões de mensagens para manter o código mais organizado e facilitar a manutenção
const config_messages = require('../modelo/configMessages.js')

//Import do arquivo de DAO para manipular os dados no banco de dados
const statusDAO = require('../../../model/DAO/status/status.js')

// Função para validar os dados do status
const validarDados = async (status) =>{
    let message = JSON.parse(JSON.stringify(config_messages))

    if(status.nome == undefined || status.nome == "" || status.nome == null || status.nome.length > 20){
        message.ERROR_BAD_REQUEST.field = "[nome] invalido"
        return message.ERROR_BAD_REQUEST
    }

    return false
}

// Função para inserir um novo status
const inserirStatus = async (status, contentType) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let validar = await validarDados(status)

            if(validar){
                return validar
            } else {
                let result = await statusDAO.insertStatus(status)

                if(result){
                    status.id = result
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = status
                }
                else {
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }
                return message.DEFAULT_MESSAGE
            }
        }else{
            return message.ERROR_INVALID_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}


// Função para selecionar todos os status cadastrados
const listarStatus = async () => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let result = await statusDAO.selectAllStatus()

        if(result){
            message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
            message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
            message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
            message.DEFAULT_MESSAGE.response = result
        }
        else {
            return message.ERROR_NOT_FOUND_ITEM
        }
        return message.DEFAULT_MESSAGE
    }
    catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para selecionar um status específico pelo ID
const buscarStatusById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    if(id == undefined || id == "" || id == null || isNaN(id)){
        message.ERROR_BAD_REQUEST.field = "[id] invalido"
        return message.ERROR_BAD_REQUEST
    }else{
        try {
            let result = await statusDAO.selectStatusById(id)

            if(result){
                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
                message.DEFAULT_MESSAGE.response = result
            }
            else {
                return message.ERROR_NOT_FOUND_ITEM
            }
            return message.DEFAULT_MESSAGE
        } catch (error) {
            console.log(error)
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    }
}

// Função para deletar um status específico pelo ID
const deleteStatusById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

     try {
            let validaBuscaID = await buscarStatusById(id)
    
            //Validação para verificar se o ID é válido (não vazio, não nulo, não indefinido e é um número)
            if(validaBuscaID.status){
                let result = await statusDAO.deleteStatus(id)
            
                if(result){
                        return message.SUCCESS_DELETED_ITEM //200
                }else{
                        return message.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                message.ERROR_BAD_REQUEST.field = `[ID] invalido`
                return message.ERROR_BAD_REQUEST //400
            }
        } catch (error) {
            console.log(error)
            return message.ERROR_INTERNAL_SERVER_MODEL
        }

    
}

// Função para atualizar um status específico pelo ID
const atualizarStatus = async (id, status, contentType) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let validar = await validarDados(status)

            if(validar){
                return validar
            } else {
                let validaBuscaID = await buscarStatusById(id)

                if(validaBuscaID.status){
                    let result = await statusDAO.updateStatus(id, status)

                    if(result){
                        status.id = id
                        message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                        message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
                        message.DEFAULT_MESSAGE.response = status
                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL
                    }
                    return message.DEFAULT_MESSAGE
                }else{
                    message.ERROR_BAD_REQUEST.field = `[ID] invalido`
                    return message.ERROR_BAD_REQUEST //400
                }
            }
        }else{
            return message.ERROR_INVALID_CONTENT_TYPE
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

module.exports = {
    inserirStatus,
    listarStatus,
    buscarStatusById,
    deleteStatusById,
    atualizarStatus
}