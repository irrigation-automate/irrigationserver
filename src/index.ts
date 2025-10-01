/**
 * @module index
 * @description Main application entry point.
 * This module configures and initializes the Express application with middleware, routes, and Swagger documentation.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { getTestData, getTestError, getHello } from './Routes/tests/testController';
import cors, { CorsOptions } from 'cors';
import { setupSwagger } from './utils/swagger';
import { ErrorRequestHandler } from 'express-serve-static-core';
import { 
  createErrorResponse, 
  createValidationErrorResponse 
} from './utils/responseHelpers';

// Load environment variables from .env file
dotenv.config();

/**
 * Express application instance
 * @type {Express}
 */
const app: Express = express();

// Configure CORS options
const corsOptions: CorsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || [] 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
const testRouter = express.Router();
testRouter.get('/', getTestData);
testRouter.get('/error', getTestError);
testRouter.get('/hello/:name', getHello);
app.use('/api/test', testRouter);

// Health check routes
import healthRouter from './Routes/health';
app.use('/health', healthRouter);

// Swagger documentation (only in non-production environments)
if (process.env.NODE_ENV !== 'production') {
  console.log('📚 Swagger documentation is available at /api-docs');
  setupSwagger(app);
}

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json(createErrorResponse('Not Found', 404));
});

// Global error handler
const errorHandler: ErrorRequestHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  
  console.error('Unhandled error:', err);
  
  // Handle different types of errors
  if (err.name === 'ValidationError') {
    const validationError = err as Error & { errors?: Record<string, { message: string }> };
    const errorDetails = validationError.errors 
      ? Object.entries(validationError.errors).reduce((acc, [key, value]) => {
        acc[key] = [value.message];
        return acc;
      }, {} as Record<string, string[]>)
      : {};
    
    return res.status(400).json(createValidationErrorResponse(errorDetails));
  }
  
  // Default error response
  res.status(500).json(createErrorResponse(
    'Internal Server Error', 
    500, 
    process.env.NODE_ENV === 'development' 
      ? { message: err.message, stack: err.stack } 
      : undefined
  ));
};
app.use(errorHandler);

export default app;