const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const TicketController = require('../controllers/TicketController');
const { checkStock } = require('../middleware/checkStock'); 


    /* RUTA PARA COMPRA D CARRITO CON VALIDACION D STOCK
        Y GENERACION D TICKET */
router.post('/:cid/purchase', checkStock, CartController.purchaseCart, TicketController.generateTicket);

module.exports = router;