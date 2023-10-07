const winston = require('winston');


    /* DEFINE NIVELES D REGISTRO CON PRIORIDADES */
const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};


    /* CONFIG DEL LOGGER */
const devLogger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console({ level: 'debug' })],
});


    /* CONFIG DEL LOGGER D PRODUCCION */
const prodLogger = winston.createLogger({
  levels,
  format: winston.format.json(),
  defaultMeta: { service: 'Lautaro' }, 
  transports: [new winston.transports.File({ filename: 'errors.log', level: 'error' })],
});

module.exports = { devLogger, prodLogger };
