import swaggerJsdoc from 'swagger-jsdoc';
import env from './index.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AAVRITTY Business Solutions API',
      version: '1.0.0',
      description: 'B2B + B2C Electrical Wholesale Platform API Documentation',
      contact: {
        name: 'AAVRITTY Business Solutions',
        email: 'support@aavritty.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
