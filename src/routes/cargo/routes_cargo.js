/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por definir as rotas da API do projeto de Delicia Gelada - Cargo
* Data: 09/06/2026
* Autor: Jean Costa
* Versão 1.0
* No CRUD não precisa mudar o nome do ENDPOINT, mas sim o verbo de utilizado para cada ação (GET, POST, PUT, DELETE)
********************************************************************************************************************************************/

// Import do Express
const express = require('express')
// Criando o objeto de rotas do Express
const rota = express.Router()
// Import do controller de cargo para acessar as funções de negócio
const controllerCargo = require('../../controller/cargo/controller_cargo.js')
// Import do body-parser para manipular o corpo das requisições
const bodyParser = require('body-parser')
//Criando um objeto para manipular dados do body da API em formato JSON
const bodyParserJSON = bodyParser.json()

// Rota para inserir um novo cargo
rota.post('/cargo', bodyParserJSON, async (request, response) => {
    // recebe o conteudo dentro do body da requisição
    let dados = request.body
    let conteType = request.headers['content-type']// linha adicionada para receber o content-type do header da requisição

    let result = await controllerCargo.inserirCargo(dados,conteType)
    
    response.status(result.status_code)
    response.json(result)
})

// Rota para listar todos os cargos cadastradas
rota.get('/cargo', async (request, response) => {
    let result = await controllerCargo.listarCargo()

    response.status(result.status_code)
    response.json(result)
})

// Rota para listar um cargo específico pelo ID
rota.get('/cargo/:id', async (request, response) => {
    let id = request.params.id

    let result = await controllerCargo.buscarCargoById(id)

    response.status(result.status_code)
    response.json(result)
})

// Rota para deletar um cargo específico pelo ID
rota.delete('/cargo/:id', async (request, response) => {
    let id = request.params.id

    let result = await controllerCargo.deleteCargoById(id)

    response.status(result.status_code)
    response.json(result)
})

// Rota para atualizar um cargo específico pelo ID
rota.put('/cargo/:id', bodyParserJSON, async (request, response) => {
    let id = request.params.id
    let dados = request.body
    let conteType = request.headers['content-type']

    let result = await controllerNacionalidade.atualizarCargo(id, dados, conteType)

    response.status(result.status_code)
    response.json(result)
})

module.exports = rota
