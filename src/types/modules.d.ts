/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */

// Declare modules with their types
declare module '@/utils/responseHelpers' {
  export interface ErrorDetails {
    [key: string]: unknown;
  }

  export interface ValidationErrorDetails {
    validation: Record<string, string[]>;
  }

  export function createErrorResponse(
    message: string,
    status?: number,
    details?: ErrorDetails,
  ): {
    success: boolean;
    error: {
      message: string;
      status: number;
      details?: ErrorDetails;
      timestamp: string;
    };
  };

  export function createSuccessResponse<T = unknown>(
    data: T,
    message?: string,
  ): {
    success: true;
    data: T;
    message: string;
    timestamp: string;
  };

  export function createValidationErrorResponse(
    errors: Record<string, string[]>,
    message?: string,
  ): {
    success: false;
    error: {
      message: string;
      status: number;
      details: ValidationErrorDetails;
      timestamp: string;
    };
  };

  export function isError(error: unknown): error is Error;
}

declare module '@/utils/swagger' {
  import { Express } from 'express';

  export function setupSwagger(app: Express): void;
}

declare module '@/Routes/tests/testController' {
  import { RequestHandler } from 'express';

  export const getTestData: RequestHandler;
  export const getTestError: RequestHandler;
  export const getHello: RequestHandler;
}
