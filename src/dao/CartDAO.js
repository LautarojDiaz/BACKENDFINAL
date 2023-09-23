const Cart = require('../models/Cart');


  /* CART DAO */
class CartDAO {
  async create(cartData) {
    try {
      const cart = new Cart(cartData);
      return await cart.save();
    } catch (error) {
      throw new Error('Error creating cart');
    }
  }

  async findById(cartId) {
    try {
      return await Cart.findById(cartId);
    } catch (error) {
      throw new Error('Error finding cart');
    }
  }
}

module.exports = CartDAO;
