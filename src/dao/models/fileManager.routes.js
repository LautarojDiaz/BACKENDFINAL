const mongoose = require('mongoose');


    /* ESQUEMA Y MODELO D PRODUCTOS */
const cartSchema = new mongoose.Schema({
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
