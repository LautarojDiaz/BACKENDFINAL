const Cart = require('../models/Cart'); 

/* ACTUALIZA CARRO DESPUES D LA COMPRA */
async function updateCartAfterPurchase(cart) {
  const productsToKeep = cart.products.filter((product) => {
    return true; 
  });
  cart.products = productsToKeep;
  await cart.save();
}

module.exports = {
  updateCartAfterPurchase,
};
