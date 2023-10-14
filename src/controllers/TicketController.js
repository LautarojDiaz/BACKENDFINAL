const { Ticket } = require ('../controllers/db');
const Cart = require('../models/Cart');

/* GENERA TICKET CON LOS DETALLES DE LA COMPRA */
async function generateTicket(req, res, next) {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products');
    const ticketDetails = {
      author: req.user.id,
    };
    const ticket = new Ticket(ticketDetails);
    await ticket.save();
    res.status(201).json({ message: 'Ticket generado con éxito', ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {generateTicket,};

