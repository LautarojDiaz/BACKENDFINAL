const express = require('express');
const path = require('path');
const ProductManager = require('./ProductManager');
const Cart = require('./Cart');
const CartManager = require('./CartManager');

const app = express();
const productManager = new ProductManager(path.join(__dirname, 'data/products.json'));
const cartManager = new CartManager();


  /* INFORMACION DEL INDEX */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


  /* RUTA /api/products */
const productRouter = express.Router();


  /* OBTIENE LOS PRODUCTOS */
productRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


  /* PRODUCTO X ID */
productRouter.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});


  /* AGREGA UN PRODUCTO */
productRouter.post('/', async (req, res) => {
  try {
    const product = req.body;
    const productId = await productManager.addProduct(product);
    res.json({ id: productId });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});


  /* ACTUALIZA EL PRODUCTO */
productRouter.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedFields = req.body;
    const success = await productManager.updateProduct(productId, updatedFields);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});


  /* ELIMINA UN PRODUCTO */
productRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const success = await productManager.deleteProduct(productId);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});


  /* EXPRESS PARA EL ENRUTADOR D PRODUCTOS */
app.use('/api/products', express.json());
app.use('/api/products', productRouter);


  /* RUTA /api/carts */
const cartRouter = express.Router();


  /* NUEVO CARRITO */
cartRouter.post('/', (req, res) => {
  const newCart = cartManager.createCart();
  res.json({ message: 'Nuevo carrito creado' });
});


  /* LLEGA LISTA D PRODUCTO DEL CARRITO */
cartRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = cartManager.getCart(cartId);
  if (cart) {
    const products = cart.getProducts();
    res.json(products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});


  /* AGREGA PRODCUTO AL CARRITO */
cartRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = cartManager.getCart(cartId);
  if (cart) {
    cart.addProduct(productId);
    res.json({ message: 'Producto agregado al carrito' });
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});


  /* CONFIGURACION DEL EXPRESS PARA EL ENRUTADOR DE CARRITOS */
app.use('/api/carts', express.json());
app.use('/api/carts', cartRouter);

  /* SERVIDOR 8080 */
app.listen(8080, () => {
  console.log('Servidor iniciado en el puerto 8080');
});

module.exports = app;
