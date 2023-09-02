const express = require('express');
const router = express.Router();
const ProductManager = require('../controllers/ProductManager');


    /* OBTIENE TODOS LOS PRODUCTOS */
router.get('/', async (req, res) => {
  try {
    const products = await ProductManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
});


    /* OBTIENE PRODUCTO X ID */
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await ProductManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
});


module.exports = router;
