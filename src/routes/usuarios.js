const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosController')


router.post('/cadastro', usuariosController.cadastrarUsuarios)

router.post('/login', usuariosController.usuariosLogin)


module.exports = router