class CustomError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
  }
  
  const errorDictionary = {
    PRODUCT_NOT_FOUND: new CustomError(404, 'Producto no encontrado.'),
    PRODUCT_ALREADY_EXISTS: new CustomError(400, 'El producto ya existe.'),
  };
  
  module.exports = errorDictionary;
  