
  /* MIDDLEWARES D AUTORIZACION Y VERIFICACION D ROLES */
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    res.status(403).json({ message: 'Acceso no autorizado' });
  };
};


const checkAdmin = (req, res, next) => {
  /* S FIJA SI EL USUARIO ES ADMIN */
  if (req.user && req.user.role === 'admin') {
    return next(); 
  }
  res.status(403).json({ message: 'Acceso no autorizado' });
};


module.exports = {authorize,checkAdmin,};
