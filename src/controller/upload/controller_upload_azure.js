// Import do arquivo de configuração da AZURE
const AZURE = require('../modelo/config_upload_azure.js')

// Import da dependencia para realizar uma requisição HTTP pelo node
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const uploadFiles = async function (file) {
    if(!file || !file.buffer){
        return false
    }else{
        // Concatena no nome do arquivo a data e a hora/minuto/segundo
        let fileName = Date.now() + "_" + file.originalname

        // URL para enviar para o BD
        let urlFile = `https://${AZURE.ACCOUNT}.blob.core.windows.net/${AZURE.CONTAINER}/${fileName}`

        // URL para enviar o arquivo para o container da AZURE
        let urlFileToken = `${urlFile}?${AZURE.TOKEN}`

        let response = await fetch(urlFileToken, {
            method:     'PUT',
            headers:    {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type'  : 'application/octet-stream'
            },
            body: file.buffer
        })
    }

    if(response.status == 201)
        return urlFile
    else
        return false
}

module.exports = { uploadFiles }