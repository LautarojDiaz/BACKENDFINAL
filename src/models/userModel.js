const mongoose = require('mongoose');

// Esquema de Documento
const documentSchema = new mongoose.Schema({
  name: String,
  reference: String
});

// Esquema de Usuario
const userSchema = new mongoose.Schema({
  // Campos de usuario
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, enum: ['user', 'premium'], default: 'user' },
  documents: [documentSchema], // Estructura de documentos
  last_connection: { type: Date, default: Date.now } // Última conexión del usuario
});

// Modelo de Usuario
const User = mongoose.model('User', userSchema);

// Exportación del modelo
module.exports = User;
