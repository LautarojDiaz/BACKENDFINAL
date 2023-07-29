const Cart = require('../models/Cart');

class CartManager {
  constructor() {}

  /* AGREGA PRODUCTO AL CARRITO */
  async addProduct(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      cart.products.push(productId);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error al agregar el producto al carrito');
    }
  }

  /* ELIMINA PRODUCTO DEL CARRITO POR ID */
  async removeProduct(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      cart.products = cart.products.filter((product) => product.toString() !== productId);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error('Error al eliminar el producto del carrito');
    }
  }

  /* OBTIENE LISTA DE PRODUCTOS DEL CARRITO */
  async getProducts(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products');
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return cart.products;
    } catch (error) {
      throw new Error('Error al obtener los productos del carrito');
    }
  }

  /* CALCULA EL PRECIO TOTAL DEL CARRITO */
  async getTotalPrice(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products');
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      const totalPrice = cart.products.reduce((total, product) => total + product.price, 0);
      return totalPrice;
    } catch (error) {
      throw new Error('Error al calcular el precio total del carrito');
    }
  }
}

module.exports = CartManager;
