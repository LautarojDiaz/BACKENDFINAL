const mongoose = require('mongoose');

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

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
