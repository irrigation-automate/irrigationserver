/**
 * @module config/swagger
 * @description Swagger/OpenAPI configuration for automatic API documentation generation.
 * This module handles the setup and configuration of the Swagger documentation
 * for the Irrigation Server API.
 */

import swaggerAutogen from 'swagger-autogen';
import * as path from 'path';
import * as fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { SwaggerDocument } from '../utils/swagger';

/**
 * Defines the data models used in the API documentation.
 * These schemas are used to generate the API documentation and validate requests/responses.
 *
 * @constant {Object} modelSchemas
 * @property {Object} User - Schema for the User model
 * @property {Object} UserContact - Schema for the UserContact model
 * @property {Object} UserAddress - Schema for the UserAddress model
 * @property {Object} UserPassword - Schema for the UserPassword model
 */
const modelSchemas = {
  User: {
    type: 'object',
    properties: {
      _id: { type: 'string', description: 'Unique identifier' },
      address: { $ref: '#/components/schemas/UserAddress' },
      blocked: { type: 'boolean', default: true },
      contact: { $ref: '#/components/schemas/UserContact' },
      creation_date: { type: 'string', format: 'date-time' },
      password: { $ref: '#/components/schemas/UserPassword' },
      weather: { type: 'string', description: 'Reference to weather data' },
      reglage: { type: 'string', description: 'Reference to settings' },
    },
    required: ['address', 'blocked', 'contact', 'password', 'creation_date'],
  },
  UserContact: {
    type: 'object',
    properties: {
      _id: { type: 'string', description: 'Unique identifier' },
      email: { type: 'string', format: 'email' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      last_update: { type: 'string', format: 'date-time' },
    },
    required: ['email', 'firstName', 'lastName'],
  },
  UserAddress: {
    type: 'object',
    properties: {
      _id: { type: 'string', description: 'Unique identifier' },
      city: { type: 'string' },
      Street: { type: 'string' },
      country: { type: 'string' },
      codeZip: { type: 'integer' },
      last_update: { type: 'string', format: 'date-time' },
    },
    required: ['city', 'Street', 'country', 'codeZip'],
  },
  UserPassword: {
    type: 'object',
    properties: {
      _id: { type: 'string', description: 'Unique identifier' },
      password: { type: 'string', format: 'password' },
      last_update: { type: 'string', format: 'date-time' },
    },
    required: ['password'],
  },
};

/**
 * Main Swagger/OpenAPI configuration object.
 * This defines the metadata, security schemes, and other global settings
 * for the API documentation.
 *
 * @type {SwaggerDocument}
 * @see {@link https://swagger.io/specification/|OpenAPI Specification}
 */
const swaggerOptions: SwaggerDocument = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Irrigation Server API',
    description: 'API documentation for the Irrigation Server',
  },
  host: 'localhost:5000',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints',
    },
    {
      name: 'Irrigation',
      description: 'Irrigation system management',
    },
  ],
  paths: {},
  components: {
    schemas: {
      ...modelSchemas,
      Error: {
        type: 'object',
        properties: {
          code: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Error message' },
          errors: {
            type: 'array',
            items: { type: 'string' },
            example: ['Error detail 1', 'Error detail 2'],
          },
        },
        required: ['code', 'message'],
      },
      Success: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation successful' },
          data: { type: 'object' },
        },
        required: ['success'],
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

/**
 * Path to the output Swagger JSON file.
 * This file will be generated automatically and should not be committed to version control.
 *
 * @constant {string}
 */
const outputFile = path.join(process.cwd(), 'swagger-output.json');

/**
 * Array of file patterns to scan for OpenAPI route annotations.
 * These files should contain JSDoc comments with `@openapi` tags.
 *
 * @constant {string[]}
 */
const endpointsFiles = [
  path.join(process.cwd(), 'src/Routes/*.ts'),
  path.join(process.cwd(), 'src/Controllers/*.ts'),
];

/**
 * Generates the Swagger/OpenAPI documentation by scanning the codebase
 * for JSDoc annotations and writing the output to a JSON file.
 *
 * @async
 * @function generateSwagger
 * @returns {Promise<void>} A promise that resolves when the documentation is generated
 * @throws {Error} If there's an error during documentation generation
 *
 * @example
 * // Generate documentation
 * await generateSwagger();
 */
const generateSwagger = async (): Promise<void> => {
  try {
    console.log('🚀 Starting Swagger documentation generation...');
    console.log(`📁 Output file: ${outputFile}`);
    console.log(`🔍 Scanning files: ${endpointsFiles.join('\n   ')}`);

    // Generate the Swagger file
    await swaggerAutogen({
      openapi: '3.0.0',
      language: 'en-US',
      autoHeaders: true,
      autoQuery: true,
      autoBody: true,
      disableLogs: false,
      verbose: true,
    })(outputFile, endpointsFiles, swaggerOptions);

    console.log('✅ Swagger documentation generated successfully!');
    console.log(`📄 Documentation available at: file://${outputFile}`);
    console.log('🌐 View the documentation at: http://localhost:3000/api-docs');
  } catch (error) {
    console.error('❌ Error generating Swagger documentation:');
    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

/**
 * Sets up Swagger middleware for the Express application
 * @param {import('express').Express} app - Express application instance
 */
/**
 * Sets up Swagger middleware for the Express application
 * @param {Express} app - Express application instance
 */
export function setupSwagger(app: Express): void {
  // Load Swagger document
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../swagger-output.json'), 'utf-8'),
  ) as SwaggerDocument;

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('📚 Swagger UI is available at /api-docs');
}

// If this file is run directly, execute the generator
if (require.main === module) {
  generateSwagger().catch((error) => {
    console.error('Error in Swagger generation:', error);
    process.exit(1);
  });
}

export { generateSwagger, swaggerOptions };
