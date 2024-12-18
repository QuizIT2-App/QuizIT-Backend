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
      schemas: {
        rankingElement: {
          type: 'object',
          properties: {
            uuid: {
              type: 'integer',
              description: 'Unique identifier for the user',
            },
            name: {
              type: 'string',
              description: 'displayName of the user'
            },
            punkte: {
              type: 'integer',
              description: 'Points the user has'
            },
            isme: {
              type: 'boolean',
              description: 'boolean if it is the current user'
            }
          }
        },
        User: {
          type: object,
          properties: {
            uuid: {
              type: 'integer',
              example: 1
            },
            displayName: {
              type: 'string',
              example: 'maxi'
            },
            distinguishedName: {
              type: 'string',
              example: 'mmusterman'
            },
            vorname: {
              type: 'string',
              example: 'Max'
            },
            nachname: {
              type: 'string',
              example: 'Musterman'
            },
            jahrgang: {
              type: 'string',
              example: 1
            },
            klasse: {
              type: 'string',
              example: a
            },
            abteilung: {
              type: 'string',
              example: 'HIT'
            },
            punkte: {
              type: 'integer',
              example: 0
            },
            streak: {
              type: 'integer',
              example: 0
            },
            erstelldatum: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-12T13:57:01.000Z'
            },
            zuletztOn: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-12T13:57:01.000Z'
            },
            type: {
              type: 'string',
              example: 'schueler'
            }
          }
        },
      }
    },
  },
  apis: ['./routing/*.js'],
};


const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec),
};