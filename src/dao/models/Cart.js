const mongoose = require('mongoose');


  /* ESQUEMA DEL CARRITO */
  const cartSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', 
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  });


  /* MODELO CART */
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
