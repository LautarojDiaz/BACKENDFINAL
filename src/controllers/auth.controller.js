const passport = require('passport');
const { RegisterDTO, LoginDTO, userDTO } = require('../DAO/dto/auth.dto');
const UserModel = require('../DAO/mongo/models/users.model');
const crypto = require('crypto');
const mailer = require('../services/mailing.service');
const { createHash } = require('../utils/utils');


  /* REPARAR LA CONTRASEÑA */
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

class AuthController {
  async getSession(req, res) {
    const userId = req.user;
    try {
    if (req.isAuthenticated()) {
      const user = await UserModel.findById(userId);
      return res.status(200).json(user);
    } else {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
          
  } catch (e) {
    logger.error('Ocurrió un error en la función getSession:', e)
    return res.status(500).json({
    status: "error",
    msg: "something went wrong :(",
    data: {},
  });
  }
  }


  async getRegisterPage(req, res) {
    try {  
    return res.render('register', {});
  }
  catch (e) {
    logger.error('Ocurrió un error en la función getRegisterPage:', e)
    return res.status(500).json({
    status: "error",
    msg: "something went wrong :(",
    data: {},
  });
  }
  }

  async postRegister(req, res, next) {
    passport.authenticate('register', { failureRedirect: '/auth/failregister' })(req, res, async (error) => {
      if (error) {
        return res.redirect('/auth/failregister');
      }
      
      try {
        const userCreated = await UserModel.findOne({ email: req.body.email });
  
        if (!userCreated) {
          return res.redirect('/auth/failregister');
        }
        const currentDate = new Date();
        userCreated.last_connection = currentDate;
        await userCreated.save();
        req.login(userCreated, (error) => {
          if (error) {
            return next(error);
          }
          return res.redirect('/auth/perfil');
        });
      } catch (e) {
        logger.error('Ocurrió un error en la función postRegister:', e)
        return res.redirect('/auth/failregister');
      }
    });
  }
  

  async failRegister(req, res) {
    try {
      return res.render('fail-register')
    } catch (e) {
      return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
    }
  }

  async getLoginPage(req, res) {
    try {
      return res.render('login', {});
    } catch (e) {
      logger.error('Ocurrió un error en la función getLoginPage:', e)
      return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
    }
  }

  async postLogin(req, res, next) {
    passport.authenticate('login', async (err, user, info) => {
      if (err) {
        return res.status(500).render('error', { error: 'Error during login' });
      }
  
      if (!user) {
        return res.render('login', { error: info.message });
      }
      if (user.cart) {
        req.session.cartId = user.cart.toString();
      }
      const currentDate = new Date();
      user.last_connection = currentDate;
      try {
        await user.save();
  
        req.logIn(user, () => {
          return res.redirect('perfil');
        });
      } catch (saveErr) {
        logger.error('Ocurrió un error en la función postLogin:', e)
        return res.status(500).render('error', { error: 'Error updating last_connection' });
      }
    })(req, res, next);
  }
  

  async failLogin(req, res) {
    try {
      return res.render('fail-login')
    } catch (error) {
      logger.error('Ocurrió un error en la función failLogin:', e)
      return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
    }
  }

  async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).render('error', { error: 'no se pudo cerrar su session' });
        }
        return res.redirect('/auth/login');
      })
    }
    catch (e) {
      logger.error('Ocurrió un error en la función logout:', e)
      return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
    }
  }

  async getPerfilPage(req, res) {
    try {
      const user = req.user;
  
      if (!user) {
        return res.redirect('/auth/login');
      }
      let creator;
      let admin;
      let premium;
      let notAdmin;


      if (user.role === "premium") {
        premium = true
      } else {
        premium = false
      }


      if (user.role === "admin") {
        admin = true
        notAdmin = !admin
      } else {
        admin = false
        notAdmin = !admin
      }
      
     
      if(user.role === "premium" || user.role === "admin"){
        creator = true
      }else{
        creator = false
      }
      const userId = user._id.toString();
      return res.render('perfil', { 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        creator,
        premium,
        admin,
        notAdmin,
        userId,
       });
    } catch (e) {
      logger.error('Ocurrió un error en la función getPerfilPage:', e)
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  }
  
  async getAdminPage(req, res) {
    try {
      return res.render('secret');
    }
    catch (e) {
      logger.error('Ocurrió un error en la función getAdminPage:', e)
      return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
    }
  }

  async renderRecovery(req, res) {
    try {
      return res.render('resetPage');
    } catch (error) {
      logger.error('Ocurrió un error en la función renderRecovery:', e)
      return res.status(500).json({ error: 'Ha ocurrido un error en el restablecimiento de contraseña.' });
    }
  }
  


async recoverPassword(req, res) {
  try {
    const { email } = req.body;
    const { JWT_SECRET } = process.env;
    const { password, password2 } = req.body

    if (password !== password2) {
      res.status(404).json({ message: "la contraseña no coincide" })
    }
    const user = await UserModel.findOne({ email });

    if (!user) {

      return res.status(200).render("invalid-user")
    }

    /* GENERA TOKEN JWT */
    const jwtToken = jwt.sign({ email: user.email, userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const resetPasswordLink = `https://proyecto-backend-9f3q.onrender.com/auth/reset-password/${jwtToken}`;



    /* ENVIA CORREO D RECUPERACION */
    await mailer.sendPasswordRecoveryEmail(user.email, resetPasswordLink);

    /* RESPONDE MJS D EXISTO */
    return res.render("send-message")

  
  } catch (error) {
    logger.error('Ocurrió un error en la función recoverPassword:', e)
    return res.status(500).json({ error: 'Ha ocurrido un error en la recuperación de contraseña.' });
  }
}

async renderResetPasswordPage (req, res){
  const { token } = req.params;

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findOne({ email: decodedToken.email });

    if (!user) {
      // el user no existe
      return res.render('resetPassword', { error: 'Usuario no encontrado' });
    }
    res.render('resetPassword', { token });
  } catch (error) {
    logger.error('Ocurrió un error en la función renderResetPasswordPage:', e)
    res.render('resetPassword', { error: 'Token inválido' });
  }
};

async resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    const { JWT_SECRET } = process.env;
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (decodedToken){
    }
    const user = await UserModel.findOne({ email: decodedToken.email });

    if (!user) {

      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    /* ACTUALIZAR CONTRASEÑA AL USUARIO */
    user.password = createHash(newPassword);
    await user.save();


    /* RESPONDER CON UN MJS D EXITO */
    return res.render('passwordResetSuccess')
  } catch (error) {
    logger.error('Ocurrió un error en la función resetPassword:', e)
    return res.status(500).json({ error: 'Ha ocurrido un error en el restablecimiento de contraseña.' });
  }
}

}

module.exports = new AuthController();