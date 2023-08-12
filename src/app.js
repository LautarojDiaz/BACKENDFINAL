const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const UserModel = require('./models/userModel');
const ProductManager = require('./controllers/ProductManager');
const CartManager = require('./controllers/CartController');
const ProductModel = require('./models/ProductModel');

const PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


  /* CONFIGURACION BASE DE DATOS MongoDB CON Mongoose */
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));


  /* CONFIGURACION Handlebars */
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


  /* RUTA A index.handlebars */
app.get('/', (req, res) => {
  res.render('index');
});

  /* RUTA A products.handlebars */
app.get('/products', async (req, res) => {
  try {
    const products = await ProductManager.getProducts();
    res.render('products', { products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


  /* RUTA LISTA D PRODUCTOS PAGINADOS /products/paginated */
app.get('/products/paginated', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const query = req.query.query || {};

    const products = await ProductModel.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ _id: sort });

    const totalProducts = await ProductModel.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('productsPaginated', {
      products: products,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      limit: limit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


  /* REGISTRO DE CUENTA */
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', [
  check('name').notEmpty().withMessage('El nombre es requerido'),
  check('email').isEmail().withMessage('El correo electrónico no es válido'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name: name,
      email: email,
      password: hashedPassword
    });

    res.redirect('/login');
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el registro' });
  }
});


  /* LOGIN */
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', [
  check('email').isEmail().withMessage('El correo electrónico no es válido'),
  check('password').notEmpty().withMessage('La contraseña es requerida')
], async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        req.session.user = { email: user.email, role: user.role };
        res.redirect('/products');
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});


/* LOGOUT */
app.post('/logout', (req, res) => {
  req.session.destroy(); // Destruye la sesión
  res.redirect('/login'); // Redirige al usuario a la página de inicio de sesión
});


  /* FINALIZAR LA SESION DEL USARIO*/
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});


  /* MOSTRAR FORMULARIO */
app.get('/register', (req, res) => {
  res.render('register'); 
});


  /* PROCESAR REGISTRO CUANDO S ENVIE FORMULARIO */
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    res.redirect('/login');
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el registro' });
  }
});


  /* VERIFICION DE LAS CREDENCIALES DEL USUARIO */
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
            /* CREDENCIALES VALIDAS, CREAR UNA SESION */
        req.session.user = { email: user.email, role: user.role };
        res.redirect('/products');
      } else {

          /* CONSTRASEÑA INCORRECTA */
        res.redirect('/login');
      }
    } else {
          /* USUARIO NO ENCONTRADO */
      res.redirect('/login');
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});


  /* REGISTRO E INICIAR SESION */
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name: name,
      email: email,
      password: hashedPassword
    });

    res.redirect('/login');
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el registro' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        req.session.user = { email: user.email, role: user.role };
        res.redirect('/products');
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});


  /* SERVIDOR  */
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


  /* RUTA CARRITO ESPECIFICO  */
app.get('/carts/:cartId', async (req, res) => {
  const cartId = req.params.cartId;
  const cart = await cartManager.getCart(cartId);
  if (cart) {
    const products = cart.getProducts();
    const total = products.reduce((acc, product) => acc + product.price, 0);
    res.render('cart', { products, total });
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});


  /* RUTA LISTA PRODUCTOS PAGINADOS */
app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const query = req.query.query || {};
    const products = await ProductManager.getProductsPaginated(limit, page, sort, query);
    res.render('productsPaginated', {
      products: products.payload, 
      hasNextPage: products.hasNextPage,
      hasPrevPage: products.hasPrevPage,
      nextPage: products.nextPage,
      prevPage: products.prevPage,
      limit: limit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


  /* CartManager */
const cartManager = new CartManager();


  /* CREAR NUEVO CARRITO */
app.post('/api/carts', async (req, res) => {
  const cartId = await cartManager.createCart();
  res.json({ cartId });
});


  /* OBTIENE INFO DE CARRITO X SU ID */
app.get('/api/carts/:cartId', async (req, res) => {
  const cartId = req.params.cartId;
  const cart = await cartManager.getCart(cartId);
  res.json({ cart });
});


  /* AGREGAR PRODUCTO AL CARRITO */
app.post('/api/carts/:cartId/products/:productId', async (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.params.productId;
  const result = await cartManager.addProductToCart(cartId, productId);
  res.json({ success: result });
});


  /* ELIMINAR PRODUCTO DEL CARRITO */
app.delete('/api/carts/:cartId/products/:productId', async (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.params.productId;
  const result = await cartManager.removeProductFromCart(cartId, productId);
  res.json({ success: result });
});


  /* OBTENER LISTA D PRODUCTOS DEL CARRITO */
app.get('/api/carts/:cartId/products', async (req, res) => {
  const cartId = req.params.cartId;
  const products = await cartManager.getCartProducts(cartId);
  res.json({ products });
});

const students = [
  { name: 'Estudiante 1' },
  { name: 'Estudiante 2' },
  { name: 'Estudiante 3' },
  { name: 'Estudiante 4' },
  { name: 'Estudiante 5' },
];

app.get('/students', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const currentStudents = students.slice(startIndex, endIndex);
  const totalPages = Math.ceil(students.length / limit);

  res.render('students', {
    students: currentStudents,
    currentPage: page,
    totalPages: totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page - 1,
    nextPage: page + 1,
  });
});


  /* VISUALIZA CARRITO ESPECIFICO CON DETALLES */
app.get('/carts/:cartId', async (req, res) => {
  const cartId = req.params.cartId;
  const cart = await cartManager.getCart(cartId);
  if (cart) {
    const products = cart.getProducts();
    const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    res.render('cartDetails', { products, total });
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});


  /* ACTUALIZAR CANTIDAD D UN PRODUCTO EN EL CARRITO */
app.put('/api/carts/:cartId/products/:productId', async (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.params.productId;
  const newQuantity = parseInt(req.body.quantity);
  try {
    const success = await cartManager.updateProductQuantity(cartId, productId, newQuantity);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cantidad del producto' });
  }
});


  /* ELIMINAR PRODUCTO D CARRITO Y try...catch POR SI EXISTE ALGUN ERROR  */
app.delete('/api/carts/:cartId/products/:productId', async (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.params.productId;

  try {
    const success = await cartManager.removeProductFromCart(cartId, productId);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
});


  /* PRODUCTOS PAGINADOS CON FILTROS Y ORDENAMIENTO */
app.get('/api/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const query = req.query.query || {};

    const products = await ProductManager.getProductsPaginated(limit, page, sort, query);
    const totalProducts = await ProductManager.getTotalProducts(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      status: 'success',
      payload: products,
      totalPages: totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}` : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


  /* SERVIDOR Y CONFIGURACION Socket.IO */
io.on('connection', (socket) => {
  console.log('Cliente conectado');


  /* EVENTOD D Socket.IO */
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});


  /* INICIAR SERVER */
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


  /* CONEXIÓN A LA BASE DE DATOS MONGODB */
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));


  /* INFORMACION A INDEX */
app.get('/', (req, res) => {
  res.render('index'); 
});


  /* CONFIGURACIÓN DE Socket.IO PARA MANEJO DE EVENTOS EN TIEMPO REAL */
io.on('connection', (socket) => {
  console.log('Cliente conectado');


  /* EVENTO AGREGAR PRODUCTO DESDE realTimeProducts.handlebars  */
  socket.on('addProduct', async (productData) => {
    try {
      const productId = await productManager.addProduct(productData);
      io.emit('productAdded', { id: productId, ...productData });
    } catch (error) {
      console.error('Error al agregar el producto:', error.message);
    }
  });


  /* EVENTO ELIMINAR PRODUCTO DESDE realTimeProducts.handlebars */
  socket.on('deleteProduct', async (productId) => {
    try {
      const success = await productManager.deleteProduct(productId);
      if (success) {
        io.emit('productDeleted', productId);
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
    }
  });


  /* EVENTO ENVIAR MENSAJE DESDE chat.handlebars */
  socket.on('sendMessage', async (message) => {
    try {
    } catch (error) {
      console.error('Error al enviar el mensaje:', error.message);
    }
  });
});


/* RUTA /realtimeproducts */
app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {
      pageTitle: 'Real Time Products',
      products: products
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


/* RUTA /api/products */
const productRouter = express.Router();


/* OBTIENE LOS PRODUCTOS */
productRouter.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


/* PRODUCTO X ID */
productRouter.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});


/* AGREGA UN PRODUCTO */
productRouter.post('/', async (req, res) => {
  try {
    const product = req.body;
    const productId = await productManager.addProduct(product);
    res.json({ id: productId });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});


  /* ACTUALIZA EL PRODUCTO */
productRouter.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedFields = req.body;
    const success = await productManager.updateProduct(productId, updatedFields);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});


  /* ELIMINA UN PRODUCTO */
productRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const success = await productManager.deleteProduct(productId);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});


  /* RUTA /api/carts */
const cartRouter = express.Router();


  /* NUEVO CARRITO */
cartRouter.post('/', (req, res) => {
  const newCart = cartManager.createCart();
  res.json({ message: 'Nuevo carrito creado' });
});


  /* LLEGA LISTA DE PRODUCTO DEL CARRITO */
cartRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = cartManager.getCart(cartId);
  if (cart) {
    const products = cart.getProducts();
    res.json(products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});


  /* AGREGA PRODUCTO AL CARRITO */
cartRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = cartManager.getCart(cartId);
  if (cart) {
    cart.addProduct(productId);
    res.json({ message: 'Producto agregado al carrito' });
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});


/* EXPRESS PARA EL ENRUTADOR DE PRODUCTOS */
app.use('/api/products', express.json());
app.use('/api/products', productRouter);


/* CONFIGURACION DEL EXPRESS PARA EL ENRUTADOR DE CARRITOS */
app.use('/api/carts', express.json());
app.use('/api/carts', cartRouter);


module.exports = app;