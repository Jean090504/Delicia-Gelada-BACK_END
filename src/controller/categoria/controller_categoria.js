/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo controle de dados do projeto Delicia Gelada - CRUD de Categorias
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

//Import do arquivo de padrões de mensagens para manter o código mais organizado e facilitar a manutenção
const config_messages = require('../modelo/configMessages.js')

//Import do arquivo de DAO para manipular os dados no banco de dados
const categoriaDAO = require('../../../model/DAO/categoria/categoria.js')
const statusController = require('../status/controller_status.js')

// Função para validar os dados da categoris
const validarDados = async (categoria) =>{
    let message = JSON.parse(JSON.stringify(config_messages))

    if(categoria.nome == undefined || categoria.nome == "" || categoria.nome == null){
        message.ERROR_BAD_REQUEST.field = "[nome] é obrigatorio e não pode ser vazio"
        return message.ERROR_BAD_REQUEST
    }else{
        return false
    }
}

// Função para inserir uma nova categoria
const inserirCategoria = async (categoria, contentType) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try{
        if (String(contentType).toLowerCase() == 'application/json') {
            let validar = await validarDados(categoria)

            if(validar){
                return validar
            } else {
                let result = await categoriaDAO.insertCategoria(categoria)

                if(result){
                    categoria.id = result
                    message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                    message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                    message.DEFAULT_MESSAGE.response = categoria
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

// Função para selecionar todas as categorias cadastradas
const listarCategorias = async () => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let result = await categoriaDAO.selectAllCategoria()

        // Validação para verificar se existe conteúdo no array
        if(result.length > 0){
            
            for(let categoria of result){

                // ********************
                //        Status
                // ********************

                // Busca o status utilizando o ID do status presente na categoria
                let resultStatus = await statusController.buscarStatusById(categoria.id_status)
    
               // Se encontrou o status com sucesso, anexa ao JSON da categoria
               if(resultStatus.status){
                // Pega o status (seja ele um array ou um objeto direto)
                let dadosStatus = resultStatus.response[0] || resultStatus.response;
                
                // Adiciona o NOME do status na categoria
                categoria.status_categoria = dadosStatus.nome; 
                
                // Remove o ID original
                delete categoria.id_status; 
            }
            }

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

// Função para selecionar uma categoria específica pelo ID
const buscarCategoriaById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    if(id == undefined || id == "" || id == null || isNaN(id)){
        message.ERROR_BAD_REQUEST.field = "[id] invalido"
        return message.ERROR_BAD_REQUEST
    } else {
        try {
            let result = await categoriaDAO.selectCategoriaById(id)

            if(result){
                let categoria = result.length > 0 ? result[0] : result;

                // ********************
                //        Status
                // ********************
                
                // Busca o status utilizando o ID presente na categoria
                let resultStatus = await statusController.buscarStatusById(categoria.id_status)

                // Se encontrar o status, adiciona no JSON e remove o id_status original
                if(resultStatus.status){
                    let dadosStatus = resultStatus.response[0] || resultStatus.response;
                    categoria.status_categoria = dadosStatus.nome;
                    delete categoria.id_status;
                }

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

// Função para deletar uma categoria específica pelo ID
const deleteCategoriaById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let validaBuscaID = await buscarCategoriaById(id)

        // Ele só vai ler o .status se a variável validaBuscaID realmente existir!
        if(validaBuscaID && validaBuscaID.status){
            
            let result = await categoriaDAO.deleteCategoria(id)
        
            if(result){
                return message.SUCCESS_DELETED_ITEM // 200
            }else{
                return message.ERROR_INTERNAL_SERVER_MODEL // 500
            }

        } else {
            // Se validaBuscaID for undefined, devolvemos um erro padrão 404 seguro.
            if (validaBuscaID) {
                return validaBuscaID
            } else {
                // Caso a sua mensagem no config seja apenas ERROR_NOT_FOUND, ajuste abaixo:
                message.ERROR_BAD_REQUEST.field = "[ID] não encontrado"
                return message.ERROR_BAD_REQUEST 
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para atualizar uma categoria específica pelo ID
const atualizarCategoria = async (id, categoria, contentType) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let validar = await validarDados(categoria)

            if(validar){
                return validar
            } else {
                let validaBuscaID = await buscarCategoriaById(id)

                if(validaBuscaID.status){
                    let result = await categoriaDAO.updateCategoria(id, categoria)

                    if(result){
                        categoria.id = id
                        message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                        message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
                        message.DEFAULT_MESSAGE.response = categoria
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
    inserirCategoria,
    listarCategorias,
    buscarCategoriaById,
    deleteCategoriaById,
    atualizarCategoria
}