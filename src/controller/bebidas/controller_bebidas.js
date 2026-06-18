/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo controle de dados do Crud de Bebidas do projeto Delícia Gelada
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

// Import do arquivo de padrões de mensagens
const config_messages = require('../modelo/configMessages.js')

// Import do DAO de Bebida
const bebidaDAO = require('../../../model/DAO/bebidas/bebidas.js')

// Import do Controller da Tabela Intermediária para trazer as categorias da bebida!
const categoriaBebidaController = require('../bebidas/controller_categoria_bebidas.js')

// Import da controller que faz o upload da foto
const UPLOAD = require('../upload/controller_upload_azure.js')
const { application } = require('express')

// Função para validar os dados da bebida
const validarDados = async (bebida) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    if(bebida.nome == undefined || bebida.nome == "" || bebida.nome == null || bebida.nome.length > 80){
        message.ERROR_BAD_REQUEST.field = "[nome] é obrigatorio, não pode ser vazio e deve ter no máximo 80 caracteres"
        return message.ERROR_BAD_REQUEST
    }else if(bebida.descricao == undefined || bebida.descricao == "" || bebida.descricao == null){
        message.ERROR_BAD_REQUEST.field = "[descricao] é obrigatoria e não pode ser vazia"
        return message.ERROR_BAD_REQUEST
    }else if(bebida.preco == undefined || bebida.preco == "" || bebida.preco == null || isNaN(bebida.preco)){
        message.ERROR_BAD_REQUEST.field = "[preco] é obrigatorio e deve ser um número válido"
        return message.ERROR_BAD_REQUEST
    // }else if(bebida.imagem == undefined || bebida.imagem == "" || bebida.imagem == null || bebida.imagem.length > 255){
    //     message.ERROR_BAD_REQUEST.field = "[imagem] é obrigatoria e não pode ser vazia"
    //     return message.ERROR_BAD_REQUEST
    }else if(bebida.id_tipo_bebida == undefined || bebida.id_tipo_bebida == "" || bebida.id_tipo_bebida == null || isNaN(bebida.id_tipo_bebida)){
        message.ERROR_BAD_REQUEST.field = "[id_tipo_bebida] é obrigatorio e deve ser um número válido"
        return message.ERROR_BAD_REQUEST
    }else if(bebida.id_usuario == undefined || bebida.id_usuario == "" || bebida.id_usuario == null || isNaN(bebida.id_usuario)){
        message.ERROR_BAD_REQUEST.field = "[id_usuario] é obrigatorio e deve ser um número válido"
        return message.ERROR_BAD_REQUEST
    }else if(bebida.id_status == undefined || bebida.id_status == "" || bebida.id_status == null || isNaN(bebida.id_status)){
        message.ERROR_BAD_REQUEST.field = "[id_status] é obrigatorio e deve ser um número válido"
        return message.ERROR_BAD_REQUEST
    }

    return false // Passou em todas as validações
}

// Função para inserir uma nova bebida
const inserirBebida = async (bebida, contentType, imagem) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    if(!contentType || !contentType.includes('multipart/form-data')){
        return message.ERROR_CONTENT_TYPE
    }

    try{
        let validar = await validarDados(bebida)

        if(validar){
            return validar
        }

        if(!imagem){
            message.ERROR_BAD_REQUEST.field = "[imagem] é obrigatoria e não pode ser vazia"
            return message.ERROR_BAD_REQUEST
        }

        // Envia a foto para ser feito o upload do arquivo
        let urlImagem = await UPLOAD.uploadFiles(imagem)
        console.log(urlImagem)

        if(!urlImagem){
            return message.ERROR_UPLOADED_FILE
        }

        // Adiciona a url do arquivo após o upload
        bebida.imagem = urlImagem
        console.log(bebida)
        
            let result = await bebidaDAO.inserirBebida(bebida) 

            if(result){
                bebida.id = result
                message.DEFAULT_MESSAGE.status = message.SUCCESS_CREATED_ITEM.status
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_CREATED_ITEM.status_code
                message.DEFAULT_MESSAGE.message = message.SUCCESS_CREATED_ITEM.message
                message.DEFAULT_MESSAGE.response = bebida
            }
            else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
            return message.DEFAULT_MESSAGE

    }catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// A função agora recebe os 'parametros' passados na URL
const listarBebidas = async (parametros) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let result = await bebidaDAO.listarBebidas() 

        if(result && result.length > 0){
            for(let bebida of result){
                let resultCategorias = await categoriaBebidaController.buscarCategoriaByIdBebida(bebida.id)
                
                if(resultCategorias.status){
                    bebida.categorias = resultCategorias.response
                } else {
                    bebida.categorias = [] 
                }
            }
            
            // Lê o parâmetro da URL. Se a URL tiver "?maior_de_18=true", libera tudo.
            const ehMaiorDe18 = parametros && parametros.maior_de_18 === 'true';

            let bebidasFiltradas = result;

            // Se NÃO for maior de 18, filtramos
            if (!ehMaiorDe18) {
                bebidasFiltradas = result.filter(bebida => {
                    // A lógica agora é: a bebida só aparece se ela tiver 
                    // explicitamente a categoria "Não alcoólicos" (ID 7)
                    // OU se o seu tipo de bebida não for alcoólico.
                    
                    const temCategoriaNaoAlcoolica = bebida.categorias.some(cat => 
                        cat.id === 7 || cat.nome.toLowerCase().includes("não alcoólico")
                    )
                    
                    return temCategoriaNaoAlcoolica;
                })
            }
            
            message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status 
            message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
            message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
            message.DEFAULT_MESSAGE.response = bebidasFiltradas
            
            return message.DEFAULT_MESSAGE
        }
        else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para buscar uma bebida pelo ID
const buscarBebidaById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        if(id == undefined || id == '' || id == null || isNaN(id)){
            message.ERROR_BAD_REQUEST.field = `[ID] invalido`
            return message.ERROR_BAD_REQUEST 
        }

        let result = await bebidaDAO.buscarBebidaById(id) 

        if(result && result.length > 0){
            let bebida = result[0] // Pega o objeto da bebida

            // Busca as categorias dessa bebida específica
            let resultCategorias = await categoriaBebidaController.buscarCategoriaByIdBebida(bebida.id)
            
            if(resultCategorias.status){
                bebida.categorias = resultCategorias.response
            } else {
                bebida.categorias = []
            }

            message.DEFAULT_MESSAGE.status = message.SUCCESS_RESPONSE.status 
            message.DEFAULT_MESSAGE.status_code = message.SUCCESS_RESPONSE.status_code
            message.DEFAULT_MESSAGE.message = message.SUCCESS_RESPONSE.message
            message.DEFAULT_MESSAGE.response = bebida

            return message.DEFAULT_MESSAGE
        }
        else {
            return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_MODEL
    }
}

// Função para atualizar uma bebida pelo ID
const atualizarBebidaById = async (bebida, id, contentType) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try{
        if (String(contentType).toLowerCase() == 'application/json') {
            
            let validaBuscaID = await buscarBebidaById(id)

            if(validaBuscaID.status){
                let validar = await validarDados(bebida)

                if(validar){
                    return validar
                } else {
                    let result = await bebidaDAO.updateBebida(bebida, id) 

                    if(result){
                        bebida.id = id
                        message.DEFAULT_MESSAGE.status = message.SUCCESS_UPDATE_ITEM.status 
                        message.DEFAULT_MESSAGE.status_code = message.SUCCESS_UPDATE_ITEM.status_code
                        message.DEFAULT_MESSAGE.message = message.SUCCESS_UPDATE_ITEM.message
                        message.DEFAULT_MESSAGE.response = bebida
                        return message.DEFAULT_MESSAGE
                    } else {
                        return message.ERROR_INTERNAL_SERVER_MODEL
                    }
                }
            } else {
                return validaBuscaID // Retorna o erro 404
            }
        }else{
            return message.ERROR_CONTENT_TYPE
        }
    }catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Função para deletar uma bebida pelo ID
const deletarBebidaById = async (id) => {
    let message = JSON.parse(JSON.stringify(config_messages))

    try {
        let validaBuscaID = await buscarBebidaById(id)

        if(validaBuscaID && validaBuscaID.status){
            
            // ANTES DE DELETAR A BEBIDA, TEMOS QUE LIMPAR A TABELA INTERMEDIÁRIA!
            await categoriaBebidaController.deletarCategoriaByIdBebida(id)

            let result = await bebidaDAO.deleteBebida(id) 

            if(result){
                message.DEFAULT_MESSAGE.status = message.SUCCESS_DELETED_ITEM.status 
                message.DEFAULT_MESSAGE.status_code = message.SUCCESS_DELETED_ITEM.status_code
                message.DEFAULT_MESSAGE.message = message.SUCCESS_DELETED_ITEM.message
                message.DEFAULT_MESSAGE.response = null
                return message.DEFAULT_MESSAGE
            }
            else {
                return message.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
             return validaBuscaID || message.ERROR_NOT_FOUND 
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirBebida,
    listarBebidas,
    buscarBebidaById,
    atualizarBebidaById,
    deletarBebidaById
}