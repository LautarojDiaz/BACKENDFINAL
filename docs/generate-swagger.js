const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const swaggerConfig = require('./swagger-config'); 

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Mi Proyecto Final',
      version: '1.0.0',
      description: 'Documentación de la API de Mi Proyecto Final.',
    },
  },
  apis: [swaggerConfig.modules[0].routes, swaggerConfig.modules[1].routes], 
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Swagger corriendo en el puerto ${PORT}`);
});