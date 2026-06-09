/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo controle de dados do Crud de relacionamento categoria-bebida (N:M) - Delícia Gelada
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

//Import do arquivo de padrões de mensagens
const config_messages = require('../modelo/configMessages.js')

//Import do arquivo de DAO para manipular os dados no banco de dados
const categoriaBebidaDAO = require('../../../model/DAO/categoria_bebidas/categoria_bebidas.js')

// Função para validar os dados do relacionamento categoria-bebida
const validarDados = async (categoriaBebida) => {
    let message = JSON.parse(JSON.stringify(config_messages))
    
    if(categoriaBebida.id_categoria == undefined || categoriaBebida.id_categoria == "" || categoriaBebida.id_categoria == null || isNaN(categoriaBebida.id_categoria)){
        message.ERROR_BAD_REQUEST.field = "[id_categoria] invalido"
        return message.ERROR_BAD_REQUEST

    }else if(categoriaBebida.id_bebida == undefined || categoriaBebida.id_bebida == "" || categoriaBebida.id_bebida == null || isNaN(categoriaBebida.id_bebida)){
        message.ERROR_BAD_REQUEST.field = "[id_bebida] invalido"
        return message.ERROR_BAD_REQUEST
    }
    
    return false // Retorna falso se não houver erro
}

// Função para vincular uma categoria a uma bebida
const inserirCategoriaBebida = async (categoriaBebida) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let resultadoValidacao = await validarDados(categoriaBebida)

        if(resultadoValidacao){
            return resultadoValidacao
        } else {
            let result = await categoriaBebidaDAO.insertCategoriaBebida(categoriaBebida)

            if(result){
                categoriaBebida.id = result 
                message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                message.DEFAULT_MESSAGE.response = categoriaBebida
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
            return message.DEFAULT_MESSAGE
        }
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER 
    }
}

// Função para selecionar todos os relacionamentos de categoria-bebida cadastrados
const listarCategoriaBebida = async () => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let result = await categoriaBebidaDAO.selectAllCategoriaBebida()

        if(result){
            if(result.length > 0){
                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
                message.DEFAULT_MESSAGE.response = result // Padronizado para o Delícia Gelada

                return message.DEFAULT_MESSAGE
            }else{
                return message.ERROR_NOT_FOUND
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
        
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para selecionar um relacionamento específico pelo ID da tabela intermediária
const buscarCategoriaBebidaById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            message.ERROR_BAD_REQUEST.field = `[ID] invalido`
            return message.ERROR_BAD_REQUEST 
        }else{
            let result = await categoriaBebidaDAO.selectCategoriaBebidaById(id)

            if(result){
                if(result.length > 0 || result.id !== undefined){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
                    message.DEFAULT_MESSAGE.response = result

                    return message.DEFAULT_MESSAGE
                }else{
                    return message.ERROR_NOT_FOUND
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }  
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para listar todas as bebidas de uma categoria específica
const buscarBebidaByIdCategoria = async (id_categoria) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        if(id_categoria == undefined || id_categoria == '' || id_categoria == null || isNaN(id_categoria)){
            message.ERROR_BAD_REQUEST.field = `[id_categoria] invalido`
            return message.ERROR_BAD_REQUEST 
        }else{
            let result = await categoriaBebidaDAO.selectBebidaByIdCategoria(id_categoria)

            if(result){
                if(result.length > 0){
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
                    message.DEFAULT_MESSAGE.response = result

                    return message.DEFAULT_MESSAGE
                }else{
                    return message.ERROR_NOT_FOUND
                }
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }  
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para listar todas as categorias de uma bebida específica
const buscarCategoriaByIdBebida = async (id_bebida) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        if(id_bebida == undefined || id_bebida == '' || id_bebida == null || isNaN(id_bebida)){
            message.ERROR_BAD_REQUEST.field = `[id_bebida] invalido`
            return message.ERROR_BAD_REQUEST 
        } else {
            let result = await categoriaBebidaDAO.selectCategoriaByIdBebida(id_bebida)

            if(result){
                if(result.length > 0){
                    return {
                        status: message.SUCCESS_RESPONSE.status,
                        status_code: message.SUCCESS_RESPONSE.status_code,
                        message: message.SUCCESS_RESPONSE.message,
                        response: result 
                    }
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        }   
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para deletar um relacionamento pelo ID primário da tabela intermediária
const deletarCategoriaBebida = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let validaBuscaID = await buscarCategoriaBebidaById(id)

        if(validaBuscaID.status){
            let result = await categoriaBebidaDAO.deleteCategoriaBebida(id)
        
            if(result){
                return message.SUCCESS_DELETED_ITEM 
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL 
            }
        }else{
            message.ERROR_BAD_REQUEST.field = `[ID] invalido`
            return message.ERROR_BAD_REQUEST 
        }
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para deletar todas as associações de categorias de uma bebida específica (limpeza)
const deletarCategoriaByIdBebida = async (id_bebida) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let result = await categoriaBebidaDAO.deleteCategoriaByIdBebida(id_bebida)

        if(result){
            return message.SUCCESS_DELETED_ITEM 
        }else{
            return message.ERROR_INTERNAL_SERVER_MODEL 
        }
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para atualizar uma associação específica pelo ID primário
const atualizarCategoriaBebida = async (id, categoriaBebida) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    let validaBuscaID = await buscarCategoriaBebidaById(id)

    if(validaBuscaID.status){
        try {
            let resultadoValidacao = await validarDados(categoriaBebida)

            if(resultadoValidacao){
                return resultadoValidacao
            } else {
                let result = await categoriaBebidaDAO.updateCategoriaBebida(id, categoriaBebida)

                if(result){
                    categoriaBebida.id = id
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_UPDATE_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_UPDATE_ITEM.message
                    message.DEFAULT_MESSAGE.response = categoriaBebida
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL
                }
                return message.DEFAULT_MESSAGE
            }
        } catch (error) {
            console.error(error)
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    }else{
        message.ERROR_BAD_REQUEST.field = `[ID] invalido`
        return message.ERROR_BAD_REQUEST 
    }
}

module.exports = {
    inserirCategoriaBebida,
    listarCategoriaBebida,
    buscarCategoriaBebidaById,
    deletarCategoriaBebida,
    atualizarCategoriaBebida,
    buscarBebidaByIdCategoria,
    buscarCategoriaByIdBebida,
    deletarCategoriaByIdBebida
}