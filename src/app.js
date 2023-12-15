const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const productRouter = require('./routes/product.router.js');
const cartRouter = require('./routes/cart.router.js');
const homeRouter = require('./routes/home.router.js');
const rtpRouter = require('./routes/rpt.socket.router.js')
const chatRouter = require('./routes/chat.socket.router.js');
const viewsRouter = require('./routes/views.router.js');
const authRouter = require('./routes/auth.router.js')
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const FileStoreSession = require('session-file-store')(session);
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require("path");
const { serialize } = require('v8');
const ProductManager = require('./DAO/memory/productManager.js');
const { connectMongo } = require('./utils/utils.js');
const ChatModel = require('./DAO/mongo/models/chat.socket.model.js');
const MongoStore = require('connect-mongo');
const iniPassport = require('./config/passport.config.js');
const passport = require('passport');
const sessionsRouter = require('./routes/sessions.router.js');
const mockingRouter = require('./routes/mocking.router.js');
const loggerRouter = require('./routes/logger.router.js');
const productManager = new ProductManager('product.json')
const logger = require('./utils/logger.js');
const configureSockets = require('./configure.socket.js');
const userRouter = require('./routes/user.router.js');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');


const app = express();
require('dotenv').config();



  /* MULTER */
const multerConfig = require("./multer.config.js");

const baseUrl = process.env.BASE_URL || 'http://localhost'; 
const port = process.env.PORT || 8080;

const httpServer = http.createServer(app);


  /* SOCKETS en configure.sockets.js*/
configureSockets(httpServer)


  /* MONGO ATLAS */
const mongoose = require('mongoose');
let connection;

if (!connection) {
  connection = mongoose.createConnection('mongodb://localhost:27017/CODER', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  connection.once('open', () => {
    console.log('Conexión exitosa a MongoDB');
  });

  connection.on('error', (error) => {
    console.error('Error de conexión a MongoDB', error);
  });
}

connectMongo()


  /* EXPRESS */
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


  /* BODY-PARSER */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


  /* HANDLEBARS */
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


  /* CONFIGURACION STATIC */
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
  /*  */

  /* PASSPORT */
iniPassport();
app.use(passport.initialize());
app.use(passport.session());

// createLogger();
app.get("/", (req, res) => {
  res.redirect("/auth/login"); 
});


  /* OPCIONES SWAGGER JSDOC */
const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, 'utils', 'swagger-config.yaml')], 
};

const swaggerSpec = swaggerJSDoc(options);


//------Endpoint Documentación----------
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api', userRouter)
app.use('/api/sessions', sessionsRouter);
app.use('/homeHandlebars', homeRouter);
app.use('/chat', chatRouter);
app.use('/views', viewsRouter);
app.use('/auth', authRouter);
app.use('/', mockingRouter)
app.use('/', loggerRouter)
app.get('/get-session', (req, res) => {
  const cartId = req.session;
  loggerInstance.info("routesession")
  res.json({ cartId });
});

  /* INICIO SERVER HTTP */
httpServer.listen(port, (error) => {
  if (error) {
    console.error('Error al iniciar el servidor:', error);
  } else {
    console.log(`Servidor escuchando en ${baseUrl}:${port}`);
  }
});
