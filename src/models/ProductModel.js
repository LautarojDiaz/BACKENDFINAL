const mongoose = require('mongoose');


  /* ESQUEMA DEL PRODUCTO */
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  availability: { type: Boolean, default: true },
  owner: { type: String, ref: 'User', default: 'admin' } 
});

module.exports = mongoose.model('Product', productSchema);
