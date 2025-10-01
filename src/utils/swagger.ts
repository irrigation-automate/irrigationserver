import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response, NextFunction } from 'express';
import { readFile } from 'fs/promises';
import path from 'path';

/**
 * Interface representing a Swagger/OpenAPI document
 */
interface SwaggerDocument {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: {
    [path: string]: {
      [method in 'get' | 'post' | 'put' | 'delete' | 'patch']?: {
        tags?: string[];
        summary?: string;
        description?: string;
        parameters?: Array<{
          name: string;
          in: 'query' | 'header' | 'path' | 'cookie';
          description?: string;
          required?: boolean;
          schema: {
            type: string;
            format?: string;
          };
        }>;
        requestBody?: {
          description: string;
          required: boolean;
          content: {
            [contentType: string]: {
              schema: {
                $ref: string;
              };
            };
          };
        };
        responses: {
          [statusCode: string]: {
            description: string;
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
  components?: {
    schemas?: {
      [name: string]: {
        type: string;
        properties: Record<string, unknown>;
        required?: string[];
      };
    };
  };
}

/**
 * Sets up Swagger/OpenAPI documentation for the Express application
 * @param {Express} app - The Express application instance
 */
export const setupSwagger = (app: Express): void => {
  const swaggerPath = path.join(process.cwd(), 'swagger-output.json');
  
  // Serve Swagger UI
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
  
  // Serve raw JSON
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
  
  console.log('Swagger documentation available at /api-docs');
};
