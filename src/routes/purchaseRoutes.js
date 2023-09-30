const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const TicketController = require('../controllers/TicketController');
const { checkStock } = require('../middleware/checkStock');
const Product = require('../models/Product');


  /* RUTA PARA FINALIZAR LA COMPRA DEL CARRITO */
router.post('/:cid/purchase', checkStock, async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartController.getCartById(cid);
    const products = cart.products;

    for (const product of products) {
      const productData = await Product.findById(product.productId);
      if (!productData || product.quantity > productData.stock) {
        return res.status(400).json({ error: 'Producto fuera de stock' });
      }
    }

  /* GENERA TICKET */
const ticket = await TicketController.generateTicket(req, res);

  /* ACTUALIZA CARRITO DESPUÉS DE COMPRAR */
await CartController.updateCartAfterPurchase(cart);

res.status(200).json({ message: 'Compra realizada con éxito', ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al realizar la compra' });
  }
});

module.exports = router;
