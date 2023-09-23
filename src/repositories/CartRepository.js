const CartDAO = require('../dao/CartDAO'); 


  /* REPOSITORIO D CARRITOS */
class CartRepository {
  constructor() {
    this.cartDAO = new CartDAO();
  }

  async create(cartData) {
    return this.cartDAO.create(cartData);
  }

  async findById(cartId) {
    return this.cartDAO.findById(cartId);
  }
}

module.exports = CartRepository;
