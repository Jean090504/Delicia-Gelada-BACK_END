/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela API do projeto Delicia Gelada
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

app.use(express.json())


app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.sendStatus(200)
})

const corsOptions = {
    origin: function(origin, callback) {
        callback(null, true) // permite qualquer origem
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

app.use(cors(corsOptions))


app.use(helmet({
    crossOriginResourcePolicy: false
}))

const cargoRotas = require('./src/routes/cargo/routes_cargo.js')
const tipoBebidaRotas = require('./src/routes/tipo_bebida/routes_tipo_bebida.js')
const statusRotas = require('./src/routes/status/routes_status.js')
const categoriaRotas = require('./src/routes/categoria/routes_categoria.js')
const usuarioRotas = require('./src/routes/usuario/routes_usuario.js')
const bebidaRotas = require('./src/routes/bebidas/routes_bebidas.js')

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