const Ticket = require('../models/Ticket');
const Cart = require('../models/Cart'); 


  /* GENERA TICKET CON LOS DETALLES D LA COMPRA */
async function generateTicket(req, res, next) {
  const { cid } = req.params;
  const cart = await Cart.findById(cid).populate('products');
  const ticketDetails = {
    author: req.user.id,
};


  /* NEW TICKER USANDO EL MODELO TICKET K DEFINISTE ANTES */
const ticket = new Ticket(ticketDetails);


  /* GUARDA EL TICKET EN LA BASE D DATOS */
await ticket.save();
  res.status(201).json({ message: 'Ticket generado con éxito', ticket });
}

module.exports = {
  generateTicket,
};
