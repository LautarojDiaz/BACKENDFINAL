const mongoose = require('mongoose');
const Cart = require('../models/Cart'); 

class CartManager {
  /* CREA CARRO NUEVO EN BASE DE DATOS Y DEVUELVE SU ID */
  async createCart() {
    try {
      const newCart = new Cart();
      await newCart.save();
      return newCart._id;
    } catch (error) {
      console.error('Error al crear el carrito:', error.message);
      return null;
    }
  }

  /* OBTIENE EL CARRO POR SU ID, JUNTO CON SU INFORMACIÓN */
  async getCart(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products');
      return cart;
    } catch (error) {
      console.error('Error al obtener el carrito:', error.message);
      return null;
    }
  }

  /* AGREGA UN PRODUCTO AL CARRO ESPECÍFICO POR SU ID */
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

  /* ELIMINA UN PRODUCTO DEL CARRO ESPECÍFICO POR SU ID */
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


  /* OBTIENE LA LISTA DE PRODUCTOS DEL CARRO ESPECÍFICO POR SU ID */
async getCartProducts(cartId) {
  try {
    const cart = await Cart.findById(cartId).populate('products');
    return cart.products;
  } catch (error) {
    console.error('Error al obtener los productos del carrito:', error.message);
    return [];
  }
}
}
