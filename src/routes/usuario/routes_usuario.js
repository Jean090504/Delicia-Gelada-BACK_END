/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por definir as rotas da API do projeto de Delicia Gelada - Usuário
* Data: 09/06/2026
* Autor: Jean Costa
* Versão 1.0
* No CRUD não precisa mudar o nome do ENDPOINT, mas sim o verbo de utilizado para cada ação (GET, POST, PUT, DELETE)
********************************************************************************************************************************************/

const express = require('express')
const rota = express.Router()
const controllerUsuario = require('../../controller/usuario/controller_usuario.js')
const controllerLogin = require('../../controller/autenticacao/controller_autenticacao_usuario.js')
const bodyParser = require('body-parser')
const { validarToken } = require('../../middleware/jwt.js')
const { upload } = require('../../controller/config_multer/multer.js')

//Criando um objeto para manipular dados do body da API em formato JSON
const bodyParserJSON = bodyParser.json()


// Rota de cadastro com Multer
rota.post('/usuario', upload.single('foto'), async (request, response) => {
    // Quando usamos Multer, o Content-Type se torna 'multipart/form-data'
    let contentType = request.headers['content-type']
    
    // Os campos de texto vão para o request.body
    let dadosBody = request.body

    // O arquivo físico da imagem vai para o request.file
    let arquivoFoto = request.file

    // Encaminha tudo para o Controller (adicionando o parâmetro do arquivo)
    let dados = await controllerUsuario.inserirUsuario(dadosBody, contentType, arquivoFoto)

    response.status(dados.status_code).json(dados)
})

// Rota para listar todas os usuários
rota.get('/usuario', async (request, response) => {
    let result = await controllerUsuario.listarUsuarios()

    response.status(result.status_code)
    response.json(result)
})

// Rota para listar um usuário específico por ID
rota.get('/usuario/:id', async (request, response) => {
    let id = request.params.id

    let result = await controllerUsuario.buscarUsuarioById(id)

    response.status(result.status_code)
    response.json(result)
})

// Rota para atualizar um usuário existente
rota.put('/usuario/:id', validarToken, async (request, response) => {
    let id = request.params.id;
    
    let contentType = request.headers['content-type'];
    
    let dadosBody = request.body;

    let dados = await controllerUsuario.atualizarUsuarioById(dadosBody, id, contentType);

    response.status(dados.status_code).json(dados);
})

// Rota para excluir um usuário existente
rota.delete('/usuario/:id', validarToken, async (request, response) => {
    let id = request.params.id

    // Você salvou o retorno na variável "dados"
    let dados = await controllerUsuario.deletarUsuarioById(id)

    // Então precisa usar "dados" aqui também!
    response.status(dados.status_code)
    response.json(dados)
})

// Rota de login para autenticação do usuário
rota.post('/login', bodyParserJSON, async (request, response) => {
    let email = request.body.email
    let senha = request.body.senha

    let result = await controllerLogin.autenticar(email, senha)

    if (result) {
        response.status(200).json({ status: true, token: result })
    } else {
        response.status(401).json({ status: false, message: "Falha na autenticação" })
    }
})

module.exports = rota
