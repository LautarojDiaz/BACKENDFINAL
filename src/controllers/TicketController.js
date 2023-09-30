const { Ticket } = require('../config/db');
const Cart = require('../models/Cart');

/* GENERA TICKET CON LOS DETALLES DE LA COMPRA */
async function generateTicket(req, res, next) {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products');
    const ticketDetails = {
      author: req.user.id,
    };

    /* Crea un nuevo ticket utilizando el modelo Ticket definido anteriormente */
    const ticket = new Ticket(ticketDetails);

    /* Guarda el ticket en la base de datos */
    await ticket.save();

    res.status(201).json({ message: 'Ticket generado con éxito', ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  generateTicket,
};

