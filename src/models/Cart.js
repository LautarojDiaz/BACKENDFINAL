const mongoose = require('mongoose');


  /* ESQUEMA D CARRITO D COMPRAS */
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
