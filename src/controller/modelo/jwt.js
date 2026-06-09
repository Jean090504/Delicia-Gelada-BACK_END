// src/modelo/jwt.js
const jwt = require('jsonwebtoken');
const SECRET = '123456'; // Idealmente, use process.env.JWT_SECRET

const validarToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    
    // O padrão é 'Bearer <token>'
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return response.status(401).json({ message: "Acesso negado. Token não fornecido." });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return response.status(403).json({ message: "Token inválido ou expirado." });
        
        request.user = user; // Salva o usuário no request para usar depois
        next();
    });
};

module.exports = { validarToken };