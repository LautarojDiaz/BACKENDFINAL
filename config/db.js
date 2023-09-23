// config/db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tickets', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ticketSchema = new mongoose.Schema({
  // Define la estructura del modelo Ticket aquí
  // Por ejemplo: title, description, createdBy, etc.
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = {
  Ticket,
};
