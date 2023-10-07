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

module.exports = new CartController();
