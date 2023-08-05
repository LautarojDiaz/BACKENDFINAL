const mongoose = require('mongoose');

    /* ESQUEMA DEL PRODUCTO */
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  availability: { type: Boolean, default: true },
});


    /* MODEL PRODUCTO ESQUEMA */
const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
