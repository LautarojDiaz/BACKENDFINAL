const mongoose = require('mongoose');


  /* ESQUEMA Y MODELO */
const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);


  /* EXPORTA EL MODELO Y LA CONEXIÓN EN UN OBJETO */
module.exports = {
  Ticket,
  connectToDatabase: function () {
    const mongoURI = 'mongodb://localhost:27017/ecommerce';
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on('error', (error) => {
      console.error('Error de conexión a MongoDB:', error);
    });
    db.once('open', () => {
      console.log('Conexión a MongoDB establecida con éxito');
    });
  },
};


module.exports = {Ticket,connectToDatabase: function() {}};
