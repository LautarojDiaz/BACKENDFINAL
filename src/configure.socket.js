const socketIO = require('socket.io');
const ChatModel = require('./DAO/mongo/models/chat.socket.model.js');
const ProductModel = require('./DAO/mongo/models/products.model.js');
const ProductService = require('./services/product.service.js');
const productService = new ProductService();

const productModel = new ProductModel();

function configureSockets(httpServer) {
  const io = socketIO(httpServer);

io.on('connection', (socket) => {
console.log("se abrió un canal de socket");
  
  /* AÑADIR PRODUCTOS A PERSISTENCIA
      (recibe datos de index.js) */
socket.on("newProduct", async (prod) => {
const newProduct = await productService.addProduct(prod);
const updatedProducts = await productService.getProductsByOwner(prod.owner);
  
    /* DEVUELVE PRODUCTOS ACTUALIZADOS AL DOM */
io.emit("productListUpdated", updatedProducts);
});
  
    /* ELIMINA PRODUCTOS D PERSISTENCIA */
socket.on("deleteProdId", async (productId ) => {
const deleteProd = await productService.deleteOne(productId);
const email = deleteProd.owner;
const updatedProducts = await productService.getProductsByOwner(email);


   /* RECIBE MJS DESDE EL FRONT index.js */
socket.on('chat-front-to-back', async (data) => {
try {
const chat = await ChatModel.create(data);
       
  /*LOS REENCIA A TODOS LOS FRONTS */
const chats = await ChatModel.find({}).lean().exec();
const { messages } = chat;
  let msgs = messages.map((message) => {
      return { user: message.user, message: message.message };
});
    io.emit('chat-back-to-all', msgs);
} catch (e) {
console.error(e);
      }
    });
  });
}

module.exports = configureSockets;
