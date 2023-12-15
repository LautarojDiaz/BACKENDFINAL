const passport = require('passport');

class AuthService {
    /* FUNCION PARA REALIZAR LA AUTENTICACION CON PASSPORT */
  async authenticateLogin(req, res, next) {
    passport.authenticate('login', { failureRedirect: '/auth/faillogin' })(req, res, next);
  }

  /* FUNCION PARA ACTUALIZAR LA SESION DEL USUARIO DESPUES DEL REGISTRO */
  updateSession(req, user) {
    req.session.user = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      role: user.role,
      isAdmin: user.isAdmin
    };
  }
}

module.exports = new AuthService();