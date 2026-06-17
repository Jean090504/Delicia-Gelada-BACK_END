/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo controle de dados do projeto Delicia Gelada - CRUD do Tipo de Bebida
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

//Import do arquivo de padrões de mensagens para manter o código mais organizado e facilitar a manutenção
const config_messages = require('../modelo/configMessages.js')

//Import do arquivo de DAO para manipular os dados no banco de dados
const tipoBebidaDAO = require('../../../model/DAO/tipo_bebida/tipo_bebida.js')

// Função para validar os dados do tipo de bebida
const validarDados = async (tipoBebida) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    // Validação do NOME (Obrigatório, máx 45)
    if (!tipoBebida.nome || tipoBebida.nome == "" || tipoBebida.nome.length > 45) {
        message.ERROR_BAD_REQUEST.field = "[nome] inválido ou excede 45 caracteres."
        return message.ERROR_BAD_REQUEST
    }
    
    // Validação do VOLUME (Obrigatório, máx 10)
    if (!tipoBebida.volume || tipoBebida.volume == "" || tipoBebida.volume.length > 10) {
        message.ERROR_BAD_REQUEST.field = "[volume] inválido ou excede 10 caracteres."
        return message.ERROR_BAD_REQUEST
    }

    // Validação do TEOR ALCOÓLICO (Obrigatório, máx 10)
    if (!tipoBebida.teor_alcoolico || tipoBebida.teor_alcoolico == "" || tipoBebida.teor_alcoolico.length > 10) {
        message.ERROR_BAD_REQUEST.field = "[teor_alcoolico] inválido ou excede 10 caracteres."
        return message.ERROR_BAD_REQUEST
    }

    // Validação do MODO DE PREPARO (Obrigatório, TEXT)
    if (!tipoBebida.modo_preparo || tipoBebida.modo_preparo == "") {
        message.ERROR_BAD_REQUEST.field = "[modo_preparo] é obrigatório."
        return message.ERROR_BAD_REQUEST
    }

    // Validação dos INGREDIENTES (Obrigatório, TEXT)
    if (!tipoBebida.ingredientes || tipoBebida.ingredientes == "") {
        message.ERROR_BAD_REQUEST.field = "[ingredientes] são obrigatórios."
        return message.ERROR_BAD_REQUEST
    }

    // Validação do PERFIL DE SABOR (Opcional, mas se enviado, máx 50)
    if (tipoBebida.perfil_sabor && tipoBebida.perfil_sabor.length > 50) {
        message.ERROR_BAD_REQUEST.field = "[perfil_sabor] excede 50 caracteres."
        return message.ERROR_BAD_REQUEST
    }

    // Validação da DICA DELÍCIA (Opcional, mas se enviada, máx 255)
    if (tipoBebida.dica_delicia && tipoBebida.dica_delicia.length > 255) {
        message.ERROR_BAD_REQUEST.field = "[dica_delicia] excede 255 caracteres."
        return message.ERROR_BAD_REQUEST
    }
    
    // Se passar por todos os ifs, os dados estão corretos
    return false
}

// Função para inserir um novo tipo de bebida
const inserirTipoBebida = async (tipoBebida, contentType) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let validar = await validarDados(tipoBebida)

            if(validar){
                return validar
            } else {
                let result = await tipoBebidaDAO.insertTipoBebida(tipoBebida)

                if(result){
                    tipoBebida.id = result 
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = tipoBebida
                } else {
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

// Função para selecionar todos os tipos de bebida cadastrados
const listarTipoBebida = async () => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let result = await tipoBebidaDAO.selectAllTipoBebida()

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

// Função para selecionar um tipo de bebida específico pelo ID
const buscarTipoBebidaById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    if(id == undefined || id == "" || id == null || isNaN(id)){
        message.ERROR_BAD_REQUEST.field = "[id] invalido"
        return message.ERROR_BAD_REQUEST
    }else{
        try {
            let result = await tipoBebidaDAO.selectTipoBebidaById(id)

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

// Função para deletar um tipo de bebida específico pelo ID
const deleteTipoBebidaById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

     try {
            let validaBuscaID = await buscarTipoBebidaById(id)
    
            //Validação para verificar se o ID é válido (não vazio, não nulo, não indefinido e é um número)
            if(validaBuscaID.status){
                let result = await tipoBebidaDAO.deleteTipoBebida(id)
            
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

// Função para atualizar um tipo de bebida específico pelo ID
const atualizarTipoBebida = async (id, tipoBebida, contentType) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let validar = await validarDados(tipoBebida)

            if(validar){
                return validar
            } else {
                let validaBuscaID = await buscarTipoBebidaById(id)

                if(validaBuscaID.status){
                    let result = await tipoBebidaDAO.updateTipoBebida(id, tipoBebida)

                    if(result){
                        tipoBebida.id = id
                        message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                        message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
                        message.DEFAULT_MESSAGE.response = tipoBebida
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
    inserirTipoBebida,
    listarTipoBebida,
    buscarTipoBebidaById,
    deleteTipoBebidaById,
    atualizarTipoBebida
}