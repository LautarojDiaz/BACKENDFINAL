const winston = require('winston');

  /* DEFINIR FORMATOS D LOG PERSONALIZADOS */
const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} ${level}: ${message}`;
  })
);
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
);


  /* CREAR TRANSPORTES PARA EL MODO DESARROLLO */
const developmentTransports = [
  new winston.transports.Console({ level: 'debug', format: consoleFormat }),
];


  /* CREAR TRANSPORTES PARA EL MODO PRODUCCION */
const productionTransports = [
  new winston.transports.Console({ level: 'info', format: consoleFormat }),
  new winston.transports.File({ filename: 'errors.log', level: 'error' }),
];


  /* DETERMINAR EL MODO D EJECUCION */
const isProduction = process.env.NODE_ENV === 'production';

  /* SELECCIONAR TRANSPORTE SEGUN EL MODO */
const selectedTransports = isProduction ? productionTransports : developmentTransports;

  /* CREAR EL LOGGER */
const logger = winston.createLogger({
  levels: {
    debug: 1,
    http: 2,
    info: 3,
    warning: 4,
    error: 5,
    fatal: 6,
  },
  transports: selectedTransports,
  format: customFormat,
});

module.exports = logger;
