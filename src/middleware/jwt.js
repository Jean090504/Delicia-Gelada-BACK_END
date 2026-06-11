/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela criação e validação de tokens JWT para autenticação na API do projeto Delicia Gelada
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

const jwt = require('jsonwebtoken')
const SECRET = 'a1b2c3'
const EXPIRATION = 600

// Criar o Token
const createJwt = async (payLoad) => {
    return jwt.sign({ userID: payLoad }, SECRET, { expiresIn: EXPIRATION })
}

// Validar o Token (Versão assíncrona correta)
const validarToken = async (token) => {
    try {
        return jwt.verify(token, SECRET) // Retorna o payload se for válido
    } catch (err) {
        return false // Retorna false se o token estiver expirado ou inválido
    }
}

module.exports = { validarToken, createJwt }