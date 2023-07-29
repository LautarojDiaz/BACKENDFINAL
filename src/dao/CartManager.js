const mongoose = require('mongoose');
const Cart = require('./models/Cart');


class CartManager {
  /* CREA CARRO NUEVO EN BASE D DATOS Y DEVUELVE SU ID */
  async createCart() {
    const newCart = new Cart();
    await newCart.save();
    return newCart._id;
  }

  
  /* CARRO X SU ID, E INFO */
async getCart(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products');
      return cart;
    } catch (error) {
      return null;
    }
  }

  /* PRODUCTO AL CARRO ESPECIFICO X SU ID */
async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products.push(productId);
      await cart.save();
      return true;
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error.message);
      return false;
    }
  }


   /* BORRA PRODUCTO AL CARRO ESPECIFICO X SU ID */
async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      cart.products = cart.products.filter((p) => p.toString() !== productId);
      await cart.save();
      return true;
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error.message);
      return false;
    }
  }


  /* OBTIENE LISTA D PRODUCTOS DEL CARRO ESPECIFICO X ID */
  async getCartProducts(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products');
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return cart.products;
    } catch (error) {
      console.error('Error al obtener los productos del carrito:', error.message);
      return [];
    }
  }
}

module.exports = CartManager;
