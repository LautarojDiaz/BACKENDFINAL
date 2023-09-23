const CartRepository = require('../repositories/CartRepository'); const cartRepository = new CartRepository();


  /* SERVICIO D CARRITO */
class CartService {
  async createCart(cartData) {
    return cartRepository.create(cartData);
  }
  async getCartById(cartId) {
    return cartRepository.findById(cartId);
  }
}

module.exports = CartService;
