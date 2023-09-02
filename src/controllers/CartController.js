const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); 


  /* AGREGA PRODUCTO AL CARRITO */
router.post('/add/:cartId/:productId', async (req, res) => {
  const { cartId, productId } = req.params;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    cart.products.push(productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  /* ELIMINA PRODUCTO DEL CARRITO */
router.delete('/remove/:cartId/:productId', async (req, res) => {
  const { cartId, productId } = req.params;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    cart.products = cart.products.filter((product) => product.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  /* OBTIENE TODOS LOS PRODUCTOS DEL CARRITO */
router.get('/products/:cartId', async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await Cart.findById(cartId).populate('products');
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  /* PRECIO TOTAL DEL CARRITO */
router.get('/total-price/:cartId', async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await Cart.findById(cartId).populate('products');
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    const totalPrice = cart.products.reduce((total, product) => total + product.price, 0);
    res.json({ totalPrice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
