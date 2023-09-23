const mongoose = require('mongoose');


    /* ESQUEMA D MENSAJES */
const messageSchema = new mongoose.Schema({
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;