/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo controle de dados do projeto Delicia Gelada - CRUD de Cargo
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

//Import do arquivo de padrões de mensagens para manter o código mais organizado e facilitar a manutenção
const config_messages = require('../modelo/configMessages.js')

//Import do arquivo de DAO para manipular os dados no banco de dados
const nacionalidadeDAO = require('../../../model/DAO/cargo/cargo.js')

// Função para validar os dados do cargo
const validarDados = async (cargo) =>{
    let message = JSON.parse(JSON.stringify(config_messages))

    if(cargo.nome == undefined || cargo.nome == "" || cargo.nome == null || cargo.nome.length > 45){
        message.ERROR_BAD_REQUEST.field = "[nome] invalido"
        return message.ERROR_BAD_REQUEST
    }

    return false
}

// Função para inserir um novo cargo 
const inserirCargo = async (cargo, contentType) => {   
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let validar = await validarDados(cargo)

            if(validar){
                return validar
            } else {
                let result = await nacionalidadeDAO.insertCargo(cargo)

                if(result){
                    cargo.id = result 
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = cargo
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }
                return message.DEFAULT_MESSAGE
            }
        }else{
            return message.ERROR_INVALID_CONTENT_TYPE
        }
    }
        catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para selecionar todos aos cargos cadastrados
const listarCargo = async () => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let result = await nacionalidadeDAO.selectAllCargo()

        if(result){
            message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
            message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
            message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
            message.DEFAULT_MESSAGE.response = result
        } else {
            return message.ERROR_NOT_FOUND_ITEM
        }
        return message.DEFAULT_MESSAGE

    }
        catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}


// Função para selecionar uma nacionalidade específica pelo ID
const buscarNacionalidadeById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    if(id == undefined || id == "" || id == null || isNaN(id)){
        message.ERROR_BAD_REQUEST.field = "[id] invalido"
        return message.ERROR_BAD_REQUEST
    }else{
        try {
            let result = await nacionalidadeDAO.selectNacionalidadeById(id)

            if(result){
                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
                message.DEFAULT_MESSAGE.response = result
            } else {
                return message.ERROR_NOT_FOUND_ITEM
            }
            return message.DEFAULT_MESSAGE

        } catch (error) {
            console.log(error)
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    }
}

// Função para deletar uma nacionalidade específica pelo ID
const deleteNacionalidadeById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

     try {
            let validaBuscaID = await buscarNacionalidadeById(id)
    
            //Validação para verificar se o ID é válido (não vazio, não nulo, não indefinido e é um número)
            if(validaBuscaID.status){
                let result = await nacionalidadeDAO.deleteNacionalidade(id)
            
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

// Função para atualizar uma nacionalidade 
const atualizarNacionalidade = async (id, nacionalidade, contentType) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let validar = await validarDados(nacionalidade)

            if(validar){
                return validar
            } else {
                let validaBuscaID = await buscarNacionalidadeById(id)

                if(validaBuscaID.status){
                    let result = await nacionalidadeDAO.updateNacionalidade(id, nacionalidade)

                    if(result){
                        nacionalidade.id = id
                        message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                        message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
                        message.DEFAULT_MESSAGE.response = nacionalidade
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
    inserirNacionalidade,
    listarNacionalidade,
    buscarNacionalidadeById,
    deleteNacionalidadeById,
    atualizarNacionalidade
}