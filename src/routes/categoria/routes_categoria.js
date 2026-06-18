/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por definir as rotas da API do projeto de Delicia Gelada - Categoria
* Data: 09/06/2026
* Autor: Jean Costa
* Versão 1.0
* No CRUD não precisa mudar o nome do ENDPOINT, mas sim o verbo de utilizado para cada ação (GET, POST, PUT, DELETE)
********************************************************************************************************************************************/

const express = require('express')
const rota = express.Router()
const controllerCategoria = require('../../controller/categoria/controller_categoria.js')
const bodyParser = require('body-parser')
const { upload } = require('../../controller/config_multer/multer.js')

//Criando um objeto para manipular dados do body da API em formato JSON
const bodyParserJSON = bodyParser.json()

// Rota para inserir uma nova categoria
rota.post('/categoria', upload.single('foto'), async (request, response) => {
    // recebe o conteudo dentro do body da requisição
    let dados = request.body
    let conteType = request.headers['content-type']// linha adicionada para receber o content-type do header da requisição

    // O arquivo físico da imagem vai para o request.file
    let arquivoFoto = request.file

    let result = await controllerCategoria.inserirCategoria(dados,conteType, arquivoFoto)
    
    response.status(result.status_code).json(result)
})

// Rota para atualizar uma categoria existente
rota.put('/categoria/:id', bodyParserJSON, async (request, response) => {
    let id = request.params.id
    let dados = request.body
    let conteType = request.headers['content-type'] // linha adicionada para receber o content-type do header da requisição

    let result = await controllerCategoria.atualizarCategoria(id, dados, conteType)

    response.status(result.status_code)
    response.json(result)
})

// Rota para excluir uma categoria existente
rota.delete('/categoria/:id', async (request, response) => {
    let id = request.params.id

    // Você salvou o retorno na variável "dados"
    let dados = await controllerCategoria.deleteCategoriaById(id)

    // Então precisa usar "dados" aqui também!
    response.status(dados.status_code)
    response.json(dados)
})
// Rota para listar todas as categorias
rota.get('/categoria', async (request, response) => {
    let result = await controllerCategoria.listarCategorias()

    // Proteção: Se result for undefined ou null, definimos um padrão de erro
    if (!result) {
        return response.status(500).json({ status: false, message: "Erro interno no servidor" })
    }

    response.status(result.status_code).json(result)
})

// Rota para listar uma categoria específica por ID
rota.get('/categoria/:id', async (request, response) => {
    let id = request.params.id

    let result = await controllerCategoria.buscarCategoriaById(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = rota
