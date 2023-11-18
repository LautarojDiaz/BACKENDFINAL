const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { checkAdmin } = require('../middleware/authorization');
const upload = require('../config/multerConfig'); 

  /* RESTABLECER CONTRASEÑA */
router.post('/reset-password/:token', async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});


  /* CAMBIAR ROL USUARIO */
router.post('/change-role/:uid', checkAdmin, UserController.changeUserRole);


  /* SUBIR DOC DEL USUARIO */
router.post('/api/users/:uid/documents', upload.array('documents'), UserController.uploadDocuments);

// Solicitar restablecimiento de contraseña
  /* RESTABLECER CONTRASEÑA */
router.post('/reset-password-request', UserController.requestPasswordReset);

module.exports = router;
