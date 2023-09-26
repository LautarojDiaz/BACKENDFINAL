const express = require('express');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const userModel = require('./models/userModel'); // Elimina esta línea si no se utiliza userModel en app.js
const CartManager = require('./controllers/CartController');
const productRoutes = require('./routes/productRoutes');
const CartDAO = require('./dao/CartDAO');
const ProductDAO = require('./dao/ProductDAO');
const ProductRepository = require('./repositories/ProductRepository');
const ProductService = require('./services/ProductService');
const purchaseRoutes = require('./routes/purchaseRoutes');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const EmailService = require('./services/emailService');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { Ticket } = require('../config/db');
const ticketRoutes = require('./routes/ticketRoutes');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

/* CONFIGURACION DE RUTAS */
app.use('/cart', CartController); 
app.use('/products', productRoutes);


const productDAO = new ProductDAO();
const productRepository = new ProductRepository(productDAO);
const productService = new ProductService(productRepository);

/* PROTEGE RUTA ADMIN */
app.get('/admin', authorize('admin'), (req, res) => {
  res.send('Bienvenido, administrador');
});

const emailService = new EmailService();

/* VARIABLES DEL ENTORNO */
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const dbUrl = process.env.DB_URL;
const apiKey = process.env.API_KEY;

app.get('/admin', checkAdmin, (req, res) => {
  res.send('Bienvenido, administrador');
});

/* CONFIGURA RUTA Y LOGICA DE LA APP */
app.get('/', (req, res) => {
  const recipientEmail = 'destinatario@example.com';
  const subject = 'Asunto del correo';
  const body = 'Cuerpo del correo';

  emailService.sendEmail(recipientEmail, subject, body)
    .then(() => {
      res.send('Correo enviado exitosamente');
    })
    .catch((error) => {
      res.status(500).send('Error al enviar el correo: ' + error.message);
    });
});

const uriMongo = process.env.URI_MONGO;

/* CONFIGURA CONEXION A BASE DE DATOS MongoDB */
mongoose.connect(uriMongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

/* FUNCION ENVIA CORREO ELECTRONICO */
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
  }
};


/* CONFIGURA NUEVO USUARIO Y CONTRASEÑA */
const username = "lautarojdiaz";
const password = "sevienela7ma";

/* CADENA CONEXION CON LAS CREDENCIALES */
const uri = `mongodb+srv://${username}:${password}@cluster0.smqncp0.mongodb.net/?retryWrites=true&w=majority`;

/* MongoClient a MongoClientOptions */
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.use('/carts', purchaseRoutes);

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

/* Genera Token JWT */
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

/* INICIA EL SERVIDOR */
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
