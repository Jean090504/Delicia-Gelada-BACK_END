/*******************************************************************************************************************************************
 * Objetivo: Arquivo responsável pela API do projeto Delicia Gelada
 * Data: 09/06/2026
 * Autor: Jean Costa
 * Versão 1.0
 ********************************************************************************************************************************************/

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

// Criação do objeto app
const app = express()

// Permite que o Express entenda JSON no corpo 
app.use(express.json())

const corsOptions = {
    origin: "*",
    methods: "GET, POST, PUT, DELETE, OPTIONS", 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true 
}

app.use(cors(corsOptions))
app.use(helmet())

// --- IMPORTAÇÃO DAS ROTAS ---

const cargoRotas = require('./src/routes/cargo/routes_cargo.js')
const tipoBebidaRotas = require('./src/routes/tipo_bebida/routes_tipo_bebida.js')
const statusRotas = require('./src/routes/status/routes_status.js')
const categoriaRotas = require('./src/routes/categoria/routes_categoria.js')
const usuarioRotas = require('./src/routes/usuario/routes_usuario.js')
const bebidaRotas = require('./src/routes/bebidas/routes_bebidas.js')


app.use('/v1/fynix/deliciagelada', cors(), cargoRotas)
app.use('/v1/fynix/deliciagelada', cors(), tipoBebidaRotas)
app.use('/v1/fynix/deliciagelada', cors(), statusRotas)
app.use('/v1/fynix/deliciagelada', cors(), categoriaRotas)
app.use('/v1/fynix/deliciagelada', cors(), usuarioRotas)
app.use('/v1/fynix/deliciagelada', cors(), bebidaRotas)
app.use('/v1/fynix/deliciagelada/bebida', cors(), bebidaRotas) // Rota pública para listar bebidas

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
})