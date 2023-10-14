const Cart = require('../models/Cart');

class CartController {
  /* ACTUALIZA CARRO DESPUÉS DE LA COMPRA */
  async updateCartAfterPurchase(cart) {
    const productsToKeep = cart.products.filter((product) => {
      return true;
    });
    cart.products = productsToKeep;
    await cart.save();
  }
}


  /* LOGICA DEL CARRITO */
if (user.role === 'premium' && product.owner === user.email) {
  return res.status(400).json({ message: 'No puedes agregar tu propio producto al carrito' });
}


module.exports = new CartController();
