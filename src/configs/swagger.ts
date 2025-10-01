import swaggerAutogen from 'swagger-autogen';
import path from 'path';

/**
 * Model schemas for Swagger/OpenAPI documentation
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
      reglage: { type: 'string', description: 'Reference to settings' }
    },
    required: ['address', 'blocked', 'contact', 'password', 'creation_date']
  },
  UserContact: {
    type: 'object',
    properties: {
      _id: { type: 'string', description: 'Unique identifier' },
      email: { type: 'string', format: 'email' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      last_update: { type: 'string', format: 'date-time' }
    },
    required: ['email', 'firstName', 'lastName']
  },
  UserAddress: {
    type: 'object',
    properties: {
      _id: { type: 'string', description: 'Unique identifier' },
      city: { type: 'string' },
      Street: { type: 'string' },
      country: { type: 'string' },
      codeZip: { type: 'integer' },
      last_update: { type: 'string', format: 'date-time' }
    },
    required: ['city', 'Street', 'country', 'codeZip']
  },
  UserPassword: {
    type: 'object',
    properties: {
      _id: { type: 'string', description: 'Unique identifier' },
      password: { type: 'string', format: 'password' },
      last_update: { type: 'string', format: 'date-time' }
    },
    required: ['password']
  }
};

/**
 * Swagger/OpenAPI configuration
 */
const swaggerOptions = {
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
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
    },
  },
  components: {
    schemas: modelSchemas,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token in the format: Bearer <token>'
      }
    }
  },
  security: [{
    bearerAuth: []
  }],
  definitions: {
    Error: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Error message' },
        errors: { 
          type: 'array',
          items: { type: 'string' },
          example: ['Error detail 1', 'Error detail 2']
        }
      },
      required: ['code', 'message']
    },
    Success: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Operation successful' },
        data: { type: 'object' }
      },
      required: ['success']
    }
  },
};

/**
 * Path to the output Swagger JSON file
 */
const outputFile = path.join(process.cwd(), 'swagger-output.json');

/**
 * Files containing OpenAPI route annotations
 */
const endpointsFiles = [
  path.join(process.cwd(), 'src/Routes/*.ts'),
  path.join(process.cwd(), 'src/Controllers/*.ts')
];

/**
 * Generates Swagger/OpenAPI documentation
 * @returns {Promise<void>}
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
      verbose: true
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

// If this file is run directly, execute the generator
if (require.main === module) {
  generateSwagger().catch(error => {
    console.error('Error in Swagger generation:', error);
    process.exit(1);
  });
}

export { generateSwagger, swaggerOptions };
