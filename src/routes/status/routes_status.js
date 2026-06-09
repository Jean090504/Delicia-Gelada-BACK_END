/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por definir as rotas da API do projeto de Delicia Gelada - Status
* Data: 09/06/2026
* Autor: Jean Costa
* Versão 1.0
* No CRUD não precisa mudar o nome do ENDPOINT, mas sim o verbo de utilizado para cada ação (GET, POST, PUT, DELETE)
********************************************************************************************************************************************/

const express = require('express')
const rota = express.Router()
const controllerStatus = require('../../controller/status/controller_status.js')
const bodyParser = require('body-parser')

//Criando um objeto para manipular dados do body da API em formato JSON
const bodyParserJSON = bodyParser.json()

// Rota para inserir um novo status
rota.post('/status', bodyParserJSON, async (request, response) => {
    // recebe o conteudo dentro do body da requisição
    let dados = request.body
    let conteType = request.headers['content-type']// linha adicionada para receber o content-type do header da requisição

    let result = await controllerStatus.inserirStatus(dados,conteType)
    
    response.status(result.status_code)
    response.json(result)
})

// Rota para listar todos os status
rota.get('/status', async (request, response) => {
    let result = await controllerStatus.listarStatus()

    response.status(result.status_code)
    response.json(result)
})

// Rota para listar um status específico pelo ID
rota.get('/status/:id', async (request, response) => {
    let id = request.params.id

    let result = await controllerStatus.buscarStatusById(id)

    response.status(result.status_code)
    response.json(result)
})

// Rota para deletar um status específico pelo ID
rota.delete('/status/:id', async (request, response) => {
    let id = request.params.id

    let result = await controllerStatus.deleteStatusById(id)

    response.status(result.status_code)
    response.json(result)
})

// Rota para atualizar um status específico pelo ID
rota.put('/status/:id', bodyParserJSON, async (request, response) => {
    let id = request.params.id
    let dados = request.body
    let conteType = request.headers['content-type']

    let result = await controllerStatus.atualizarStatus(id, dados, conteType)

    response.status(result.status_code)
    response.json(result)
})

module.exports = rota
