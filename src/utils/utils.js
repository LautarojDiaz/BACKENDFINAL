const mongoose = require("mongoose");
require('dotenv').config();

async function connectMongo() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/CODER?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Conexión exitosa a MongoDB!");
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error.message);
    throw new Error("No se puede conectar a la base de datos");
  }
}

  /* MANEJO D CONTRASEÑAS CON bcrypt */
const bcrypt = require('bcrypt');

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

module.exports = { connectMongo, createHash, isValidPassword };
