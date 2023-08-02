const express = require('express');
const Cart = require('../dao/models/Cart');

const router = express.Router();


    /* CREA NUEVO CARRO */
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({});
    res.json({ message: 'Nuevo carrito creado', cartId: newCart._id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear un nuevo carrito' });
  }
});


    /* RUTA PARA RECIBIR UN CARRITO X SU ID */
router.get('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await Cart.findById(cartId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});


    /* AGREGA PRODUCTO AL CARRITO */
router.post('/:cartId/product/:productId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const cart = await Cart.findById(cartId);
    if (cart) {
      cart.products.push({ productId });
      await cart.save();
      res.json({ message: 'Producto agregado al carrito' });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

module.exports = router;
