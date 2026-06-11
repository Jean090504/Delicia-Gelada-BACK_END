/*******************************************************************************************************************************************
* Objetivo: Arquivo responsável por definir o middleware de autenticação para proteger as rotas da API do projeto Delicia Gelada
* Data: 11/06/2026
* Autor: Jean Costa
* Versão 1.0
* No CRUD não precisa mudar o nome do ENDPOINT, mas sim o verbo de utilizado para cada ação (GET, POST, PUT, DELETE)
********************************************************************************************************************************************/

const { validarToken } = require('../middleware/jwt.js')

const verificarToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    console.log("Middleware: Iniciando validação...")
    const token = authHeader && authHeader.split(' ')[1] // Pega o token depois do 'Bearer'

    if (!token) return res.status(401).json({ message: "Token ausente" })

    const ehValido = await validarToken(token)
    if (!ehValido) return res.status(403).json({ message: "Token inválido" })

    req.usuario = ehValido; // Passa os dados do user para a próxima rota
    next()
}

module.exports = { verificarToken }