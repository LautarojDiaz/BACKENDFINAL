const express = require('express');
const passport = require('passport');
const userModel = require('../models/userModel');
const emailController = require('../controllers/emailController');
const resetPasswordController = require('../controllers/resetPasswordController');


  /* RECUPERACION D CONTRASEÑA */
const router = express.Router();
router.post('/send-reset-email', emailController.sendPasswordResetEmail);
router.post('/reset-password', resetPasswordController.resetPassword);


router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
        /* DATOS PERFIL D USAURIO DESDE GitHub */
      const githubProfile = req.user._json;

        /* VERIFICA SI EL USUARIO YA EXISTE EN LA BATE D DATOS X SU CORREO ELECTRONICO */
      const existingUser = await userModel.findOne({ email: githubProfile.email });

      if (existingUser) {
            /* SI EXISTE, AL USUARIO LO MANDA AL Dashboard */
        req.login(existingUser, (err) => {
          if (err) {
            res.redirect('/login');
          } else {
            res.redirect('/dashboard');
          }
        });
      } else {
          /* SI NO EXISTE, CREA UN NUEVO REGISTRO EN LA BASE D DATOS */
        const newUser = new UserModel({
          email: githubProfile.email,
        });

        const savedUser = await newUser.save();


  /* CONFIRMA NUEVO USUARIO Y LO MANDA AL Dashboard */
        req.login(savedUser, (err) => {
          if (err) {
            res.redirect('/login');
          } else {
            res.redirect('/dashboard');
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      res.redirect('/login');
    }
  }
);

module.exports = router;
