const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tickets', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ticketSchema = new mongoose.Schema({
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = {
  Ticket,
};
