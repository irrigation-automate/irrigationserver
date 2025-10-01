import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response, NextFunction } from 'express';
import { readFile } from 'fs/promises';
import path from 'path';

/**
 * Represents the structure of a Swagger/OpenAPI document.
 * This interface defines the expected shape of the OpenAPI specification.
 * 
 * @interface
 * @name SwaggerDocument
 * @export
 */
export interface SwaggerDocument {
  /** The OpenAPI specification version being used. */
  openapi: string;
  
  /** The host (name or IP) serving the API. */
  host?: string;
  
  /** The base path on which the API is served. */
  basePath?: string;
  
  /** The transfer protocol of the API. */
  schemes?: string[];
  
  /** A list of MIME types the APIs can consume. */
  consumes?: string[];
  
  /** A list of MIME types the APIs can produce. */
  produces?: string[];
  
  /** A list of tags used by the specification with additional metadata. */
  tags?: Array<{
    /** The name of the tag. */
    name: string;
    
    /** A short description for the tag. */
    description?: string;
    
    /** Additional external documentation for this tag. */
    externalDocs?: {
      /** A short description of the target documentation. */
      description?: string;
      
      /** The URL for the target documentation. */
      url: string;
    };
  }>;
  
  /** A declaration of which security mechanisms can be used across the API. */
  security?: Array<{
    [securityScheme: string]: string[];
  }>;
  
  /** Metadata about the API. */
  info: {
    /** The title of the API. */
    title: string;
    
    /** The version of the API documentation. */
    version: string;
    
    /** A short description of the API. */
    description?: string;
  };
  
  /**
   * The available paths and operations on the API.
   * @type {Object.<string, Object.<string, import('./types').OperationObject>>}
   */
  paths: {
    [path: string]: {
      [method: string]: {
        /** Tags for API documentation control. */
        tags?: string[];
        
        /** A short summary of what the operation does. */
        summary?: string;
        
        /** A verbose explanation of the operation behavior. */
        description?: string;
        
        /** A list of parameters that are applicable for this operation. */
        parameters?: Array<{
          /** The name of the parameter. */
          name: string;
          
          /** The location of the parameter. */
          in: 'query' | 'header' | 'path' | 'cookie';
          
          /** A brief description of the parameter. */
          description?: string;
          
          /** Determines whether this parameter is mandatory. */
          required?: boolean;
          
          /** The schema defining the type used for the parameter. */
          schema: {
            type: string;
            format?: string;
          };
        }>;
        
        /** The request body applicable for this operation. */
        requestBody?: {
          /** A brief description of the request body. */
          description: string;
          
          /** Determines if the request body is required in the request. */
          required: boolean;
          
          /** The content of the request body. */
          content: {
            [contentType: string]: {
              schema: {
                $ref: string;
              };
            };
          };
        };
        
        /** The list of possible responses as they are returned from executing this operation. */
        responses: {
          [statusCode: string]: {
            /** A short description of the response. */
            description: string;
            
            /** A map containing descriptions of potential response payloads. */
            content?: {
              [contentType: string]: {
                schema: {
                  $ref: string;
                };
              };
            };
          };
        };
      };
    };
  };
  
  /** An element to hold various schemas and security schemes for the specification. */
  components?: {
    /** Reusable schema definitions */
    schemas?: {
      [name: string]: {
        type: string;
        properties: Record<string, unknown>;
        required?: string[];
      };
    };
    
    /** Security scheme definitions that can be used across the specification */
    securitySchemes?: {
      [name: string]: {
        type: 'http' | 'apiKey' | 'oauth2' | 'openIdConnect';
        description?: string;
        name?: string;
        in?: 'query' | 'header' | 'cookie';
        scheme?: string;
        bearerFormat?: string;
        flows?: {
          implicit?: {
            authorizationUrl: string;
            refreshUrl?: string;
            scopes: Record<string, string>;
          };
          password?: {
            tokenUrl: string;
            refreshUrl?: string;
            scopes: Record<string, string>;
          };
          clientCredentials?: {
            tokenUrl: string;
            refreshUrl?: string;
            scopes: Record<string, string>;
          };
          authorizationCode?: {
            authorizationUrl: string;
            tokenUrl: string;
            refreshUrl?: string;
            scopes: Record<string, string>;
          };
        };
        openIdConnectUrl?: string;
      };
    };
  };
}

/**
 * Sets up Swagger/OpenAPI documentation for the Express application.
 * 
 * This function configures the Swagger UI middleware to serve API documentation
 * at the '/api-docs' endpoint and makes the raw OpenAPI specification available
 * at '/swagger.json'.
 *
 * @param {Express} app - The Express application instance to attach the Swagger UI to.
 * @returns {void}
 * 
 * @example
 * const express = require('express');
 * const app = express();
 * setupSwagger(app);
 * // API documentation will be available at /api-docs
 */
export const setupSwagger = (app: Express): void => {
  /**
   * Path to the generated Swagger/OpenAPI JSON file.
   * @type {string}
   */
  const swaggerPath = path.join(process.cwd(), 'swagger-output.json');
  
  /**
   * Middleware to serve the Swagger UI.
   * Handles both the UI and the underlying OpenAPI specification.
   */
  app.use('/api-docs', swaggerUi.serve, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileContent = await readFile(swaggerPath, 'utf-8');
      const swaggerDocument = JSON.parse(fileContent) as SwaggerDocument;
      return swaggerUi.setup(swaggerDocument)(req, res, next);
    } catch (error) {
      console.error('Failed to set up Swagger UI:', error);
      return res.status(500).send(`
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>Swagger Documentation</h1>
          <p>To generate the Swagger documentation, please run:</p>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;">
            npm run swagger:generate
          </pre>
          <p>Then restart your server.</p>
          ${error instanceof Error ? `<p>Error: ${error.message}</p>` : ''}
        </div>
      `);
    }
  });
  
  /**
   * Endpoint to serve the raw OpenAPI specification in JSON format.
   * This is useful for API clients that need to consume the specification directly.
   */
  app.get('/swagger.json', async (req: Request, res: Response) => {
    try {
      const fileContent = await readFile(swaggerPath, 'utf-8');
      const swaggerDocument = JSON.parse(fileContent);
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerDocument);
    } catch (error) {
      console.error('Error serving swagger.json:', error);
      res.status(500).json({
        error: 'Failed to load Swagger documentation',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Log successful initialization
  console.log('📚 Swagger documentation available at /api-docs');
};
