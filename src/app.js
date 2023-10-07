const express = require('express');
const { Strategy: JwtStrategy } = require('passport-jwt');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const CartDAO = require('./dao/CartDAO');
const ProductDAO = require('./dao/productDAO');
const ProductRepository = require('./repositories/ProductRepository');
const ProductService = require('./services/productService');
const purchaseRoutes = require('./routes/purchaseRoutes');
const productRoutes = require('./routes/productRoutes');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const EmailService = require('./services/emailService');
const { MongoClient, ServerApiVersion } = require('mongodb');
const CartController = require('../src/controllers/CartController');
const { Ticket } = require('../src/controllers/db');
const ticketRoutes = require('./routes/ticketRoutes');
const errorDictionary = require('../src/utils/errorDictionary');
const { CustomError } = require('../src/middleware/errorHandler');
const { ExtractJwt } = require('passport-jwt');
const { checkAdmin } = require('../src/middleware/authorization'); 
const { devLogger, prodLogger } = require('../logger'); 
const userModel = require('../src/models/userModel');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

        
      /* Pude solucionar bastantes errores, pero aun siguen, supuestamente el puerto 3000 esta funcionando, pero
      al momento de entrar al localhost, me da error, no se en en pantalla.
      Y ademas, me esta generando error el mongoose.connect(), yo entiendo d establecer la conexion la app Node
      y eso va  a MongoDB usando la informacion, y eso encadena lleva a MongoDB URI
      Me dice que lo tengo duplicado al mongoose.connect(), lo que no esta permitido, pero por lo que estuve
      viendo lo tengo en db.js solamente (en controllers), porque antes lo tenia en una carpeta lamada config, pero
      no se porque no me aparecia en la const al momento de importar, y dije, bueno, lo meto a ahi, yo simplemente quiero
      que me funcione */



  /* URL EN FUNCION DEL ENTORNO */
const isProduction = process.env.NODE_ENV === 'production';
const mongoURI = isProduction ? process.env.PRODUCTION_DB_URI : 'mongodb://localhost:27017/ecommerce';
console.log('MongoURI:', mongoURI);
console.log('Antes de conectar a MongoDB');


          /* MONGO URI (ME DA ERROR) */
mongoose.connect(mongoURI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conexión a MongoDB establecida con éxito');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});
console.log('Después de conectar a MongoDB');


  /* MIDDLEWARE MANEJO D ERRORES */
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof CustomError) {
    res.status(err.code).json({ error: err.message });
  } else {
    res.status(500).json({ error: '¡Algo salió mal!', title: 'Error Interno del Servidor' });
  }
});


  /* RUTA LANZA ERROR */
app.get('/ruta', (req, res, next) => {
  try {
    const error = errorDictionary.PRODUCT_NOT_FOUND;
    throw new CustomError(error.code, error.message);
  } catch (error) {
    next(error);
  }
});


  /* REGISTRO D LOGS */
app.get('/loggerTest', (req, res) => {
  try {
    devLogger.debug('Mensaje de prueba de depuración');
    devLogger.info('Mensaje de prueba de información');
    devLogger.warn('Mensaje de prueba de advertencia');
    devLogger.error('Mensaje de prueba de error');
    devLogger.fatal('Mensaje de prueba de fatal');

    res.status(200).send('Prueba de registro exitosa');
  } catch (error) {
    devLogger.error('Error en la prueba de registro', error);
    res.status(500).send('Error en la prueba de registro');
  }
});


  /* CONFIGURA NUEVO USUARIO Y CONTRASEÑA */
const username = "lautarojdiaz";
const password = "sevienela7ma";


  /* CADENA CONEXION CON LAS CREDENCIALES */
const uri = `mongodb+srv://${username}:${password}@cluster0.smqncp0.mongodb.net/?retryWrites=true&w=majority`;


  /* ESTRATEGIA DE REGISTRO */
passport.use('local-register', new LocalStrategy(
  async (username, password, done) => {
    try {
      const existingUser = await userModel.findOne({ username });
      if (existingUser) {
        return done(null, false, { message: 'El nombre de usuario ya está en uso' });
      }
      const newUser = new userModel({ username, password });
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }
));


  /* Token JWT */
app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, 'contraseña1234');
  res.cookie('token', token);
  res.redirect('/dashboard');
});

  
  /* OBTENCIÓN DEL TOKEN */
app.get('/current-user', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Token no encontrado' });
  }
  jwt.verify(token, 'contraseña1234', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    userModel.findById(decoded.id, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Error al buscar usuario' });
      }
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      return res.status(200).json({ user });
    });
  });
});


  /* CONFIGURACION jwtOptions */
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
app.post('/register', passport.authenticate('local-register', {
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


  /* RUTA D CARRITO */
app.use('/cart', (req, res, next) => {
  CartController.updateCartAfterPurchase(req.cart) 
    .then(() => {
      next();
    })
    .catch((error) => {
      next(error);
    });
});


  /* RUTAS DE PRODUCTOS */
app.use('/products', productRoutes);


  /* SERVIDOR DE SOCKET.IO */
io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

  /* INICIA EL SERVIDOR */
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
