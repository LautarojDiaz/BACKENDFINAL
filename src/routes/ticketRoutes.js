const express = require('express');
const router = express.Router();
const { checkAdmin } = require('../middleware/authorization');
const { Ticket } = require('../config/db');


  /* CREA UN TICKET (REQUIERE AUTORICION D ADMIN) */
router.post('/create', checkAdmin, async (req, res) => {
  try {
    const ticketData = req.body;
    const newTicket = new Ticket(ticketData);
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
