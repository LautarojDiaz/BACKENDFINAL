const mongoose = require('mongoose');
const Schema = mongoose.Schema;


  /* ROLES */
const userSchema = new Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, enum: ['user', 'premium'], default: 'user' } 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
