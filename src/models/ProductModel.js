const mongoose = require('mongoose');
const Product = require('./models/Product');



/* ESQUEMA DEL PRODUCTO */
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  availability: { type: Boolean, default: true },
});

/* MODEL PRODUCTO ESQUEMA */
module.exports = mongoose.model('Product', productSchema);
