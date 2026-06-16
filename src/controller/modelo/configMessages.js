/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável por armazenar as mensagens de resposta da API, para manter o código mais organizado e facilitar a manutenção
 * Data: 10/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

//Padronização de cabeçalho para retorno dos endpoints da API, para manter o código mais organizado e facilitar a manutenção
const DEFAULT_MESSAGE = {
    api_description: 'API para gestão de categorias - Delícia Gelada',
    development: 'Jean Costa Alves da Silva',
    version: '1.0.4.26',
    status: Boolean,
    status_code: Number,
    response: {}
}


//Mensagem de sucesso para insert, para manter o código mais organizado e facilitar a manutenção
const SUCCESS_CREATED_ITEM = {
    status: true,
    status_code: 201,
    message: 'Registro inserido com sucesso.'
}

const SUCCESS_RESPONSE = {
    status: true,
    status_code: 200
}

const SUCCESS_UPDATE_ITEM = {
    status: true,
    status_code: 200,
    message: 'Registros atualizados com sucesso!'
}

const SUCCESS_DELETED_ITEM = {
    status: true,
    status_code: 200,
    message: 'Registro deletado com sucesso.'
}

const SUCCESS_CREATED_ITEM_WARNING = {
    status: true,
    status_code: 201,
    message: 'Registro inserido com sucesso, porém ocorreu um erro ao processar a requisição. Verifique os dados e tente novamente.'
}

//Mensagem de erro para requisição com dados incorretos ou incompletos, para manter o código mais organizado e facilitar a manutenção
const ERROR_BAD_REQUEST = {
    status: false,
    status_code: 400,
    message: 'Os dados enviados na requisição estão incorretos ou incompletos. Verifique os dados e tente novamente.'
}

//Mensagem de erro para falha na modelagem de dados, para manter o código mais organizado e facilitar a manutenção
const ERROR_INTERNAL_SERVER_MODEL ={
    status:             false,
    status_code:        500,
    message:            "Não foi possivel processar a requisicao por conta de erro na api[erro na modelagem de dados ] "
}

//Mensagem de erro para falha na controller, para manter o código mais organizado e facilitar a manutenção
const ERROR_INTERNAL_SERVER_CONTROLLER ={
    status:             false,
    status_code:        500,
    message:            "Não foi possivel processar a requisicao por conta de erro na api[ERRO NA CONTROLLER ] "
}

//Mensagem de erro para tipo de conteúdo não aceito, para manter o código mais organizado e facilitar a manutenção
const ERROR_CONTENT_TYPE ={
    status:             false,
    status_code:        415,
    message:            "Não foi possivel processar a requisicao pois o tipo de dado aceito pela api é so json"
}

const ERROR_NOT_FOUND = {
    status:             false,
    status_code:        404,
    message:            "Não foi encontrado nenhum dado para retorno!"
}

const ERROR_UPLOADED_FILE = {
    status:             false,
    status_code:        404,
    message:            "Não foi possível processar a requisição!"
}



module.exports = {
    DEFAULT_MESSAGE,
    SUCCESS_CREATED_ITEM,
    SUCCESS_RESPONSE,
    SUCCESS_UPDATE_ITEM,
    SUCCESS_DELETED_ITEM,
    SUCCESS_CREATED_ITEM_WARNING,
    ERROR_BAD_REQUEST,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_CONTENT_TYPE,
    ERROR_NOT_FOUND,
    ERROR_UPLOADED_FILE
}