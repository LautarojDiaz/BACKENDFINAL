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
const cartRoutes = require('./dao/fileManager/cart.routes');
const productRoutes = require('./dao/fileManager/product.routes');
const expressSession = require('express-session');


const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


  /* PASSAPORT Y AUTENTICACION */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const expressSession = re
quire('express-session');

  /* EXPRESS Y PASSPORT */
app.use(expressSession({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


  /* ESTRATEGIA AUTENTICACION LOCAL */
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await UserModel.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


  /* REGISTRO E INICIAR SECION (localstrategy) */
app.post('/register', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
  failureFlash: true
}));

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));


  /* ESTRATEGIA D AUTENTICACION D GITHUB */
passport.use(new GitHubStrategy({
  clientID: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
}));


  /* INICIO SESION CON GITHUB */
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);


  /* RUTA D REGISTRO (GET) */
app.get('/register', (req, res) => {
  res.render('register'); 
});

// Ruta de inicio de sesión (GET)
app.get('/login', (req, res) => {
  res.render('login'); 
});


  /* RUTA DASHBOARD (GET) */
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('dashboard', { user: req.user }); 
  } else {
    res.redirect('/login'); 
  }
});


  /* CIERRE D SESION (GET) */
app.get('/logout', (req, res) => {
  req.logout(); 
  res.redirect('/');
});


/* CONFIGURACION BASE DE DATOS MongoDB CON Mongoose */
mongoose
  .connect('mongodb://localhost:27017/ecommerce', {
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
  req.session.destroy(); 
  res.redirect('/login');
});


  /* FINALIZAR LA SESION DEL USUARIO */
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});


  /* MOSTRAR FORMULARIO */
app.get('/register', (req, res) => {
  res.render('register'); 
});


  /* PROCESAR REGISTRO CUANDO SE ENVIE EL FORMULARIO */
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    res.redirect('/login');
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el registro' });
  }
});


  /* VERIFICACIÓN DE LAS CREDENCIALES DEL USUARIO */
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        /* CREDENCIALES VÁLIDAS, CREAR UNA SESIÓN */
        req.session.user = { email: user.email, role: user.role };
        res.redirect('/products');
      } else {
        /* CONTRASEÑA INCORRECTA */
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

/* REGISTRO E INICIAR SESIÓN */
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


  /* SERVIDOR */
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


  /* RUTA CARRITO ESPECÍFICO */
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


  /* OBTENER INFO DE CARRITO POR SU ID */
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


  /* OBTENER LISTA DE PRODUCTOS DEL CARRITO */
app.get('/api/carts/:cartId/products', async (req, res) => {
  const cartId = req.params.cartId;
  const products = await cartManager.getCartProducts(cartId);
  res.json({ products });
});


  /* RUTA /students */
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


  /* VISUALIZAR CARRITO ESPECÍFICO CON DETALLES */
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


  /* ACTUALIZAR CANTIDAD DE UN PRODUCTO EN EL CARRITO */
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


  /* ELIMINAR PRODUCTO DEL CARRITO Y try...catch POR SI EXISTE ALGÚN ERROR */
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
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


  /* INICIAR EL SERVIDOR */
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


module.exports = app;