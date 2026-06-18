/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo roteamento (Endpoints) do CRUD de Bebidas
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

const express = require('express')
const rota = express.Router()

// Import do Controller de Bebidas (Ajuste o caminho dos ../ se necessário de acordo com a sua pasta)
const controllerBebida = require('../../controller/bebidas/controller_bebidas.js')

// Import da controller que faz o upload da imagem
const { upload } = require('../../controller/config_multer/multer.js')

// Rota para inserir uma nova bebida (POST)
rota.post('/bebida', upload.single('imagem'), async (request, response) => {
    // Pega o Content-Type do cabeçalho
    let contentType = request.headers['content-type']
    
    // Pega os dados enviados no corpo da requisição (JSON)
    let dadosBody = request.body

    let imagem = request.file

    // Encaminha para o Controller
    let dados = await controllerBebida.inserirBebida(dadosBody, contentType, imagem)

    // Devolve a resposta
    response.status(dados.status_code).json(dados)
})

// Rota para listar todas as bebidas (GET)
rota.get('/bebida', async (request, response) => {
    // Pegamos os parâmetros digitados na URL (ex: ?maior_de_18=true)
    let parametros = request.query
    
    // PROTEÇÃO PARA O PAINEL ADMINISTRATIVO:
    // Se a requisição tiver um Token no header (ou seja, é o Admin logado),
    // forçamos o parâmetro para 'true' para o admin ver e editar o catálogo completo
    if (request.headers['authorization']) {
        parametros.maior_de_18 = 'true'
    }

    let dados = await controllerBebida.listarBebidas(parametros)
    response.status(dados.status_code).json(dados)
})
// Rota para buscar uma bebida específica pelo ID (GET)
rota.get('/bebida/:id', async (request, response) => {
    // Pega o ID da URL
    let id = request.params.id

    // Encaminha para o Controller
    let dados = await controllerBebida.buscarBebidaById(id)

    // Devolve a resposta
    response.status(dados.status_code).json(dados)
})

// Rota para atualizar uma bebida (PUT)
rota.put('/bebida/:id', async (request, response) => {
    // Pega o ID da URL
    let id = request.params.id
    
    // Pega o Content-Type do cabeçalho
    let contentType = request.headers['content-type']
    
    // Pega os dados enviados no corpo da requisição
    let dadosBody = request.body

    // CUIDADO COM A ORDEM! O Controller espera: JSON, ID, Content-Type
    let dados = await controllerBebida.atualizarBebidaById(dadosBody, id, contentType)

    // Devolve a resposta
    response.status(dados.status_code).json(dados)
})

// Rota para deletar uma bebida (DELETE)
rota.delete('/bebida/:id', async (request, response) => {
    // Pega o ID da URL
    let id = request.params.id

    // Encaminha para o Controller
    let dados = await controllerBebida.deletarBebidaById(id)

    // Devolve a resposta
    response.status(dados.status_code).json(dados)
})

module.exports = rota