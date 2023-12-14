const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Lotter System',
      version: '1.0.0',
    },
  },
  apis: ['./controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = (app) => {
  // Serve the Swagger API documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};