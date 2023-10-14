const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { checkAdmin } = require('../middleware/authorization');


    /* CAMBIAR ROL D USUARIO A PREMIUM, O AL REVES 
        (REQUIERE PERMISO D ADMIN) */
router.post('/change-role/:uid', checkAdmin, UserController.changeUserRole);


    /* RUTA CAMBIA ROLES D USUARIOS */
router.put('/api/users/premium/:uid', updateUserRole);


    /* SOLICITA RESTABLECER LA CONTRASEÑA */
router.post('/reset-password-request', UserController.requestPasswordReset);


    /* RESTABLECE LA CONSTRASEÑA, AL HACER CLICK EN ENLACE EN MAIL */
router.post('/reset-password/:token', UserController.resetPassword);

module.exports = router;
