const express = require('express')
const router = express.Router()
const pedidosController = require('../controllers/pedidosController')


router.get('/',pedidosController.getPedidos)

router.post('/',pedidosController.postPedidos)

router.get('/:id_pedido',pedidosController.getIdPedido)

router.delete('/',pedidosController.deletePedido)


module.exports = router