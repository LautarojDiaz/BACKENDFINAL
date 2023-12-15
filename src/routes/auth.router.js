const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/auth.controller');
const AuthService = require('../services/auth.service');
const { isUser, isAdmin } = require("../middlewares/auth")
const jwt = require('jsonwebtoken');


authRouter.get('/session/current', AuthController.getSession);

authRouter.get('/register', AuthController.getRegisterPage);

authRouter.post('/register', AuthController.postRegister);


authRouter.get('/failregister', AuthController.failRegister);

authRouter.get('/login', AuthController.getLoginPage);
authRouter.post('/login', AuthService.authenticateLogin, AuthController.postLogin);
authRouter.get('/faillogin', AuthController.failLogin);
authRouter.get('/logout', AuthController.logout);
authRouter.get('/perfil', AuthController.getPerfilPage);
authRouter.get('/administracion', isAdmin, AuthController.getAdminPage);

authRouter.post('/reset-password/', AuthController.resetPassword);
authRouter.get('/recovery', AuthController.renderRecovery);
authRouter.post('/recovery', AuthController.recoverPassword);



module.exports = authRouter;