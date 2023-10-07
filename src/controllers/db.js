const mongoose = require('mongoose');

// Define la estructura del esquema Ticket
const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
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

// Crea el modelo Ticket usando el esquema ticketSchema
const Ticket = mongoose.model('Ticket', ticketSchema);

// URL a la base de datos
const mongoURI = 'mongodb://localhost:27017/tickets';

// Configuración de la conexión
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Eventos de la conexión
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Error de conexión a MongoDB:', error);
});
db.once('open', () => {
  console.log('Conexión a MongoDB establecida con éxito');
});

module.exports = { Ticket };
