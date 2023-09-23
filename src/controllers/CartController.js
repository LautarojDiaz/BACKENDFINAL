const Cart = require('../models/Cart'); 


  /* OBTENER CARRITO X ID */
async function getCartById(cartId) {
  return await Cart.findById(cartId).populate('products');
}


  /* ACTUALIZA CARRO DESPUES D LA COMPRA */
async function updateCartAfterPurchase(cart) {
  cart.products = cart.products.filter((product) => {
    return true; 
  });


  /* CARRITO ACTUALIZADO EN LA BASE D DATOS */
await cart.save();
}

module.exports = {
  getCartById,
  updateCartAfterPurchase,
};
