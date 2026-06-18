/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela API do projeto Delicia Gelada
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const multer = require('multer')

// Criação do objeto app
const app = express()

// Permite que o Express entenda JSON no corpo 
app.use(express.json())

const corsOptions = {
    origin: [
        'https://deliciageladav10.vercel.app',
        'http://localhost:5500',
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'http://127.0.0.1:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

app.use(cors(corsOptions))
app.use(helmet())

// Remova o cors() duplicado das rotas — já está configurado globalmente
app.use('/v1/fynix/deliciagelada', cargoRotas)
app.use('/v1/fynix/deliciagelada', tipoBebidaRotas)
app.use('/v1/fynix/deliciagelada', statusRotas)
app.use('/v1/fynix/deliciagelada', categoriaRotas)
app.use('/v1/fynix/deliciagelada', usuarioRotas)
app.use('/v1/fynix/deliciagelada', bebidaRotas)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
})