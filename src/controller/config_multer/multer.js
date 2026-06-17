const multer = require('multer')

// Configuração para o multer enviar o arquivo de imagem
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    }
})

// Instancia para criar um objeto upload
const upload = multer()

module.exports = {
                    storage,
                    upload
                }