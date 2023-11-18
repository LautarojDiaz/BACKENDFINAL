const UserModel = require('../models/userModel');
const upload = require('../config/multerConfig');
const multer = require('multer');

  /* RESTABLECER CONTRASEÑA */
const requestPasswordReset = async (req, res) => {
  try {
    return res.status(200).json({ message: 'Solicitud de restablecimiento de contraseña exitosa' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al procesar la solicitud de restablecimiento de contraseña' });
  }
};

  /* CAMBIAR ROL USUARIO  */
const changeUserRole = async (req, res) => {
};


  /* SUBID D DOCUMENTOS AL USUARIO X SU ID */
const uploadDocuments = async (req, res) => {
};

module.exports = {requestPasswordReset,changeUserRole,uploadDocuments};
