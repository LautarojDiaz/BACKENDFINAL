const errorDictionary = {
    NOT_FOUND: {
      code: 404,
      message: 'Recurso no encontrado.',
    },
    BAD_REQUEST: {
      code: 400,
      message: 'Solicitud incorrecta.',
    },
    UNAUTHORIZED: {
      code: 401,
      message: 'No autorizado.',
    },
    INTERNAL_SERVER_ERROR: {
      code: 500,
      message: 'Error interno del servidor.',
    },
  };
  
  module.exports = errorDictionary;
  