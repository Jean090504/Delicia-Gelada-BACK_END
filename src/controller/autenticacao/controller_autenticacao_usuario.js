/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela autenticação do usuário na API do projeto Delicia Gelada
 * Data: 11/06/2026
 * Autor: Jean Costa
 * Versão 1.1
 ********************************************************************************************************************************************/
const jwt = require('../../middleware/jwt.js') // Certifique-se de que este caminho aponta para o seu arquivo com o createJwt
const { autenticarUsuario } = require('../../../model/DAO/usuario/usuario.js')
const bcrypt = require('bcrypt')

const autenticar = async (email, senhaDigitada) => {
    // 1. Busca o usuário no DAO pelo email
    let usuarioEncontrado = await autenticarUsuario(email)

    console.log("Usuário encontrado pelo DAO:", usuarioEncontrado)

    // 2. Verifica se encontrou o usuário
    if (usuarioEncontrado && usuarioEncontrado.length > 0) {
        
        // 3. Compara a senha digitada com a hash salva no banco
        const senhaEhValida = await bcrypt.compare(senhaDigitada, usuarioEncontrado[0].senha)

        console.log("Senha digitada:", senhaDigitada)
        console.log("Senha é válida?", senhaEhValida)

        if (senhaEhValida) {
            // 4. Gera o token JWT (USANDO AWAIT)
            let payload = { id: usuarioEncontrado[0].id, email: email }
            
            // CORREÇÃO: Verifique se no seu modelo/jwt.js a função se chama 'createJwt'
            let tokenGerado = await jwt.createJwt(payload) 
            
            return tokenGerado
        }
    }
    
    // Se não encontrar usuário ou a senha estiver incorreta, retorna false
    return false
}

module.exports = { autenticar }