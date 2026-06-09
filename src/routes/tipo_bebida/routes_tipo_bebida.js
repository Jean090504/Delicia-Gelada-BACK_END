/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por definir as rotas da API do projeto de Delicia Gelada - Tipo Bebida
* Data: 09/06/2026
* Autor: Jean Costa
* Versão 1.0
* No CRUD não precisa mudar o nome do ENDPOINT, mas sim o verbo de utilizado para cada ação (GET, POST, PUT, DELETE)
********************************************************************************************************************************************/

const express = require('express')
const rota = express.Router()
const controllerTipoBebida = require('../../controller/tipo_bebida/controller_tipo_bebida.js')
const bodyParser = require('body-parser')

//Criando um objeto para manipular dados do body da API em formato JSON
const bodyParserJSON = bodyParser.json()

// Rota para inserir um novo tipo de bebida
rota.post('/tipobebida', bodyParserJSON, async (request, response) => {
    // recebe o conteudo dentro do body da requisição
    let dados = request.body
    let conteType = request.headers['content-type']// linha adicionada para receber o content-type do header da requisição

    let result = await controllerTipoBebida.inserirTipoBebida(dados,conteType)
    
    response.status(result.status_code)
    response.json(result)
})

// Rota para listar todos os tipos de bebidas
rota.get('/tipobebida', async (request, response) => {
    let result = await controllerTipoBebida.listarTipoBebida()

    response.status(result.status_code)
    response.json(result)
})

// Rota para listar um tipo de bebida específico pelo ID
rota.get('/tipobebida/:id', async (request, response) => {
    let id = request.params.id

    let result = await controllerTipoBebida.buscarTipoBebidaById(id)

    response.status(result.status_code)
    response.json(result)
})

// Rota para deletar um tipo de bebida específico pelo ID
rota.delete('/tipobebida/:id', async (request, response) => {
    let id = request.params.id

    let result = await controllerTipoBebida.deleteTipoBebidaById(id)

    response.status(result.status_code)
    response.json(result)
})

// Rota para atualizar um tipo de bebida específico pelo ID
rota.put('/tipobebida/:id', bodyParserJSON, async (request, response) => {
    let id = request.params.id
    let dados = request.body
    let conteType = request.headers['content-type']

    let result = await controllerTipoBebida.atualizarTipoBebida(id, dados, conteType)

    response.status(result.status_code)
    response.json(result)
})

module.exports = rota
