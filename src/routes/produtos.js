const express = require('express')
const router = express.Router()
const multer = require('multer')
const login = require('../middleware/login')
const produtosController = require('../controllers/produtosController')


const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/')
    },
    filename: function (req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpg'){
        cb(null, true)
    } else{
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


router.get('/',produtosController.getProdutos)

router.post('/', login, upload.single('imagem_produto'), produtosController.postProdutos)

router.get('/:id_produto', produtosController.getIdProdutos)

router.patch('/', produtosController.patchProdutos)

router.delete('/', produtosController.deleteProdutos)


module.exports = router