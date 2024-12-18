const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QuizIT API',
      version: '1.0.0',
      description: 'API documentation for the QuizIT project',
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
              example: 1
            },
            name: {
              type: 'string',
              description: 'displayName of the user',
              example: 'birni',
            },
            punkte: {
              type: 'integer',
              description: 'Points the user has',
              example: 9999
            },
            isme: {
              type: 'boolean',
              description: 'boolean if it is the current user',
              example: true
            }
          }
        },
        user: {
          type: 'object',
          properties: {
            uuid: {
              type: 'integer',
              description: 'Unique identifier for the user',
              example: 1
            },
            displayName: {
              type: 'string',
              description: 'displayName of the user',
              example: 'maxi'
            },
            distinguishedName: {
              type: 'string',
              description: 'distinguishedName of the user',
              example: 'mmusterman'
            },
            vorname: {
              type: 'string',
              description: 'firstname of the user',
              example: 'Max'
            },
            nachname: {
              type: 'string',
              description: 'surname of the user',
              example: 'Musterman'
            },
            jahrgang: {
              type: 'string',
              description: 'schoolyear of the user',
              example: 1
            },
            klasse: {
              type: 'string',
              description: 'class of the user',
              example: 'a'
            },
            abteilung: {
              type: 'string',
              description: 'department of the user',
              example: 'HIT'
            },
            punkte: {
              type: 'integer',
              description: 'Points the user has',
              example: 0
            },
            streak: {
              type: 'integer',
              description: 'daily streak the user has',
              example: 0
            },
            erstelldatum: {
              type: 'string',
              description: 'creation date of the user',
              format: 'date-time',
              example: '2024-12-12T13:57:01.000Z'
            },
            zuletztOn: {
              type: 'string',
              description: 'last time online of the user',
              format: 'date-time',
              example: '2024-12-12T13:57:01.000Z'
            },
            type: {
              type: 'string',
              description: 'type of user',
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