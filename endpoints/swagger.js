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
    tags: [
      {
        name: 'General',
        description: 'Endpoints related to general stuff including **login**, **index** and **authentication**',
      },
      {
        name: 'User',
        description: 'Endpoints related to user and user functions',
      },
      {
        name: 'Friends',
        description: 'Endpoints related to friends and friend functions',
      },
      {
        name: 'Rankings',
        description: 'Endpoints related to rankings and ranking functions',
      },
      {
        name: 'Documentation',
        description: 'Endpoints related to API documentation',
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000',
      },
      {
        url: 'https://projekte.tgm.ac.at/quizit2',
      },
    ],
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routing/*.js'],
};


const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec),
};