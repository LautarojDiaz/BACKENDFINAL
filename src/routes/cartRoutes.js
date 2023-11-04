const express = require('express');
const Cart = require('../dao/models/Cart');
const CartController = require('../controllers/CartController');
const TicketController = require('../controllers/TicketController');
const { checkStock } = require('../middleware/checkStock');

const router = express.Router();

/* CREA NUEVO CARRITO */
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({});
    res.json({ message: 'Nuevo carrito creado', cartId: newCart._id });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear un nuevo carrito' });
  }
});

/* OBTIENE UN CARRITO X ID */
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

    if (!cart) {
      // Si el carrito no existe, crea un nuevo carrito y agrega el producto.
      const newCart = await Cart.create({});
      newCart.products.push(productId);
      await newCart.save();
      res.json({ message: 'Producto agregado al nuevo carrito', cartId: newCart._id });
    } else {
      cart.products.push(productId);
      await cart.save();
      res.json({ message: 'Producto agregado al carrito', cartId: cartId });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

/* FINALIZA LA COMPRA DEL CARRITO */
router.post('/:cartId/purchase', checkStock, async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await Cart.findById(cartId);

    if (!cart || cart.products.length === 0) {
      res.status(400).json({ error: 'El carrito está vacío o no existe' });
    } else {
      // Calcular el total de la compra
      const total = calculateTotal(cart.products);

      // Generar el ticket
      const ticket = await generateTicket(cart.products, total);

      // Aquí puedes realizar otras acciones como actualizar el stock, procesar el pago, etc.
      // ...

      res.json({ message: 'Compra del carrito finalizada', ticket });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al finalizar la compra del carrito' });
  }
});

function calculateTotal(products) {
  let total = 0;
  for (const product of products) {
    total += product.price; // Ajusta esto para reflejar la estructura de tus productos.
  }
  return total;
}

async function generateTicket(products, total) {
  const ticket = {
    products,
    total,
    // Otra información relevante del ticket.
  };
  return ticket;
}

module.exports = router;
