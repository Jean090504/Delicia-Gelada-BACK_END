/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por definir as rotas da API do projeto de filmes-nacionalidade
* Data: 15/05/2026
* Autor: Jean Costa
* Versão 1.0
* No CRUD não precisa mudar o nome do ENDPOINT, mas sim o verbo de utilizado para cada ação (GET, POST, PUT, DELETE)
********************************************************************************************************************************************/

const express = require('express')
const rota = express.Router()
const controllerNacionalidade = require('../../controller/nacionalidade/controller_nacionalidade.js')
const bodyParser = require('body-parser')

//Criando um objeto para manipular dados do body da API em formato JSON
const bodyParserJSON = bodyParser.json()

// Rota para inserir uma nova nacionalidade
rota.post('/nacionalidade', bodyParserJSON, async (request, response) => {
    // recebe o conteudo dentro do body da requisição
    let dados = request.body
    let conteType = request.headers['content-type']// linha adicionada para receber o content-type do header da requisição

    let result = await controllerNacionalidade.inserirNacionalidade(dados,conteType)
    
    response.status(result.status_code)
    response.json(result)
})

// Rota para listar todas as nacionalidades cadastradas
rota.get('/nacionalidade', async (request, response) => {
    let result = await controllerNacionalidade.listarNacionalidade()

    response.status(result.status_code)
    response.json(result)
})

// Rota para listar uma nacionalidade específica pelo ID
rota.get('/nacionalidade/:id', async (request, response) => {
    let id = request.params.id

    let result = await controllerNacionalidade.buscarNacionalidadeById(id)

    response.status(result.status_code)
    response.json(result)
})

// Rota para deletar uma nacionalidade específica pelo ID
rota.delete('/nacionalidade/:id', async (request, response) => {
    let id = request.params.id

    let result = await controllerNacionalidade.deleteNacionalidadeById(id)

    response.status(result.status_code)
    response.json(result)
})

// Rota para atualizar uma nacionalidade específica pelo ID
rota.put('/nacionalidade/:id', bodyParserJSON, async (request, response) => {
    let id = request.params.id
    let dados = request.body
    let conteType = request.headers['content-type']

    let result = await controllerNacionalidade.atualizarNacionalidade(id, dados, conteType)

    response.status(result.status_code)
    response.json(result)
})


module.exports = rota
