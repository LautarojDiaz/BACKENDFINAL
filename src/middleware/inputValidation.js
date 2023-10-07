const { validationResult } = require('express-validator');


  /* FUNCION D VALIDACION D ENTRADA */
function validateInput(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}


function validateInput(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Error de validación de entrada:', errors.array()); 
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = validateInput;