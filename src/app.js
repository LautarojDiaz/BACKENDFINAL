const express = require('express');
const session = require('express-session');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const userModel = require('./models/userModel');
const authRoutes = require('./routes/authRoutes');
const ProductManager = require('./controllers/ProductManager');
const CartManager = require('./controllers/CartController');
const ProductModel = require('./models/ProductModel');
const cartRoutes = require('./dao/fileManager/cart.routes');
const productRoutes = require('./dao/fileManager/product.routes');
const CartController = require('./controllers/CartController');
const router = express.Router();
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const crypto = require('crypto');

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


  /* Configuración de jwtOptions */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'contraseña1234', 
};


  /* PASSPORT CON jwtOptions */
passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await userModel.findById(jwtPayload.id);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
}));


  /* AUTENTICACION LOCAL */
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await userModel.findOne({ username });
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


  /* AUTENTICACION DE GITHUB */
passport.use(new GitHubStrategy({
  clientID: 'aec774903a91c758909e',
  clientSecret: 'xxxx',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
}));


  /* CONFIGURACION BASE DE DATOS MongoDB CON Mongoose */
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conexión a MongoDB exitosa'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));


  /* CONFIGURACION Handlebars */
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

  
  /* GENERA CLAVE PARA LA SESIÓN */
const secretKey = crypto.randomBytes(32).toString('hex');


  /* MIDDLEWARE DE SESIÓN */
app.use(session({
  secret: secretKey,
  resave: true,
  saveUninitialized: true
}));


  /* INICIALIZACIÓN DE PASSPORT */
app.use(passport.initialize());
app.use(passport.session());

/* SERIALIZACIÓN DE USUARIO */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


  /* RUTAS DE AUTENTICACION */
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

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard', { user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});


  /* RUTA DE INICIO */
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});


  /* RUTAS DEL CARRITO */
app.use('/cart', CartController);


  /* RUTAS DE PRODUCTOS */
app.use('/products', productRoutes);


  /* SERVIDOR DE SOCKET.IO */
io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});


  /* Iniciar el servidor */
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


module.exports = app;
