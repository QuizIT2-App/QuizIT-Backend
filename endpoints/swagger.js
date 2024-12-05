const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QuizIT API',
      version: '1.0.0',
      description: 'API documentation for QuizIT',
    },
  },
  apis: ['./routing/router.js'],
};


const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec),
};