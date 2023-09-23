const checkAdmin = (req, res, next) => {


    /* S FIJA SI EL USUARIO ES ADMIN */
  if (req.user && req.user.role === 'admin') {
    return next(); 
  }
  res.status(403).json({ message: 'Acceso no autorizado' });
};

module.exports = {
  checkAdmin,
};

module.exports = {
  checkAdmin: (req, res, next) => {
  }
};