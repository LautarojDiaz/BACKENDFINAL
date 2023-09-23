
  /* VERIFICACION DE ROL D USUARIO */
function checkUserRole(role) {
    return (req, res, next) => {
      if (req.user && req.user.role === role) {
        return next();
      } else {
        return res.status(403).json({ message: 'Acceso no autorizado' });
      }
    };
  }
  
  module.exports = { checkUserRole };
  

  const { checkUserRole } = require('./authMiddleware');
  

    /* RUTA PARA ADMINISTRADORES */
  router.get('/admin', checkUserRole('admin'), (req, res) => {
    res.json({ message: 'Acceso permitido para administradores' });
  });