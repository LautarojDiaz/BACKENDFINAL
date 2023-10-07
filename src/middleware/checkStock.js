const Cart = require('../models/Cart');


  /* MIDDLEWARE D VERIFICACION D STOCK */
async function checkStock(req, res, next) {
  const { cid } = req.params;
  try {
    const cart = await Cart.findById(cid).populate('products');
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {checkStock,};
