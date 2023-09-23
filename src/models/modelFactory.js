const Cart = require('./Cart');
const Product = require('./Product');


  /* FABRICA D MODELOS */
class ModelFactory {
  static createCart() {
    return new Cart();
  }

  static createProduct() {
    return new Product();
  }
}

module.exports = ModelFactory;