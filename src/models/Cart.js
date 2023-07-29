const mongoose = require('mongoose');

  /* ESQUEMA MODELO CART CON moogose.Schema */
const cartSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
