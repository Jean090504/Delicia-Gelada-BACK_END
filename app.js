/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela API do projeto Delicia Gelada
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

O erro é que o Express 5 não aceita '*' no app.options. Troque por '/{*path}':
jsconst express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

app.use(express.json())

const corsOptions = {
    origin: function(origin, callback) {
        callback(null, true)
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

app.use(cors(corsOptions))

// ✅ Express 5 usa /{*path} em vez de *
app.options('/{*path}', cors(corsOptions))

app.use(helmet({ crossOriginResourcePolicy: false }))

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