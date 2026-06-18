/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo controle de dados do projeto Delicia Gelada - CRUD de Categorias
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.1 (Validando o campo Foto e ID_Status)
 ********************************************************************************************************************************************/

const config_messages = require('../modelo/configMessages.js')
const categoriaDAO = require('../../../model/DAO/categoria/categoria.js')
const statusController = require('../status/controller_status.js')
const azureUpload = require('../../controller/upload/controller_upload_azure.js')

// Função para validar os dados da categoria
const validarDados = async (categoria) =>{
    let message = JSON.parse(JSON.stringify(config_messages))

    // Validação do Nome (Obrigatório e limite de 50 caracteres)
    if(categoria.nome == undefined || categoria.nome == "" || categoria.nome == null){
        message.ERROR_BAD_REQUEST.field = "[nome] é obrigatório e não pode ser vazio"
        return message.ERROR_BAD_REQUEST
    } else if (categoria.nome.length > 50) {
        message.ERROR_BAD_REQUEST.field = "[nome] não pode ter mais que 50 caracteres"
        return message.ERROR_BAD_REQUEST
    } 
    
    // Validação da Foto (Obrigatório e limite de 255 caracteres)
    if(categoria.foto == undefined || categoria.foto == "" || categoria.foto == null){
        message.ERROR_BAD_REQUEST.field = "[foto] é obrigatória e não pode ser vazia"
        return message.ERROR_BAD_REQUEST
    } else if (categoria.foto.length > 255) {
        message.ERROR_BAD_REQUEST.field = "[foto] não pode ter mais que 255 caracteres"
        return message.ERROR_BAD_REQUEST
    } 

    // Validação do Status (Obrigatório, pois é Foreign Key)
    if(categoria.id_status == undefined || categoria.id_status == "" || categoria.id_status == null || isNaN(categoria.id_status)){
        message.ERROR_BAD_REQUEST.field = "[id_status] é obrigatório e deve ser um número válido"
        return message.ERROR_BAD_REQUEST
    }
    
    // Validação da Descrição (Opcional, mas se vier, valida o limite do VARCHAR(255))
    if (categoria.descricao != undefined && categoria.descricao != "" && categoria.descricao != null) {
        if (categoria.descricao.length > 255) {
            message.ERROR_BAD_REQUEST.field = "[descricao] não pode ter mais que 255 caracteres"
            return message.ERROR_BAD_REQUEST
        }
    }

    return false
}

// Função para inserir uma nova categoria
const inserirCategoria = async (categoria, contentType, file) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try{
        if (String(contentType).toLowerCase().includes('multipart/form-data')) {

            // 1. Se o arquivo da foto chegou, faz o upload para a Azure
            if (file) {
                let urlFotoAzure = await azureUpload.uploadFiles(file)
                
                if (urlFotoAzure) {
                    categoria.foto = urlFotoAzure // Injeta a URL segura no objeto do usuário
                } else {
                    return message.ERROR_INTERNAL_SERVER_MODEL // Falhou ao subir pra nuvem
                }
            }

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
                if(resultStatus && resultStatus.status){
                    let dadosStatus = resultStatus.response[0] || resultStatus.response;
                    categoria.status_categoria = dadosStatus.nome;
                    delete categoria.id_status;
                }

                message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
                message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
                // Devolve a categoria tratada (não o result bruto)
                message.DEFAULT_MESSAGE.response = categoria 
            }
            else {
                return message.ERROR_NOT_FOUND_ITEM
            }
            return message.DEFAULT_MESSAGE
        } catch (error) {
            console.log("Erro no buscarCategoriaById:", error)
            return message.ERROR_INTERNAL_SERVER_MODEL
        }
    }
}
// Função para deletar uma categoria específica pelo ID
// Função para deletar uma categoria específica pelo ID
const deleteCategoriaById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let validaBuscaID = await buscarCategoriaById(id)

        if(validaBuscaID && validaBuscaID.status){
            
            let result = await categoriaDAO.deleteCategoria(id)
        
            if(result){
                // Montamos o pacote manualmente para garantir que não vai dar undefined
                message.DEFAULT_MESSAGE.status = true
                message.DEFAULT_MESSAGE.status_code = 200
                message.DEFAULT_MESSAGE.message = "Categoria excluída com sucesso!"
                return message.DEFAULT_MESSAGE
            }else{
                return { status: false, status_code: 500, message: "Erro no banco de dados." }
            }

        } else {
            if (validaBuscaID) {
                return validaBuscaID
            } else {
                message.ERROR_BAD_REQUEST.field = "[ID] não encontrado"
                return message.ERROR_BAD_REQUEST 
            }
        }
    } catch (error) {
        console.log("Erro no BD ao deletar:", error)
        // RETORNO INFALÍVEL PARA O ERRO DE CHAVE ESTRANGEIRA (Bebidas Vinculadas)
        return {
            status: false,
            status_code: 500,
            message: "Não é possível excluir esta categoria, pois existem bebidas vinculadas a ela."
        }
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