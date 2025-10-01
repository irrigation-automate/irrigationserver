/**
 * @module utils/responseHelpers
 * @description Utility functions for creating consistent API responses.
 */

/**
 * Interface for error details
 */
interface ErrorDetails {
  [key: string]: unknown;
}

/**
 * Interface for validation error details
 */
interface ValidationErrorDetails {
  validation: Record<string, string[]>;
}

/**
 * Interface for pagination information
 */
interface PaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Interface for paginated response
 */
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  message: string;
  timestamp: string;
  pagination: PaginationInfo;
}

/**
 * Creates a standardized success response object
 * @template T - Type of the data being returned
 * @param {T} data - The data to include in the response
 * @param {string} [message='Success'] - Success message
 * @returns {Object} Standardized success response object
 */
export function createSuccessResponse<T = unknown>(
  data: T, 
  message = 'Success'
): { 
  success: true; 
  data: T; 
  message: string;
  timestamp: string;
} {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
}

/**
 * Creates a standardized error response object
 * @param {string} message - Error message
 * @param {number} [status=500] - HTTP status code
 * @param {ErrorDetails} [details] - Additional error details
 * @returns {Object} Standardized error response object
 */
export function createErrorResponse(
  message: string, 
  status = 500, 
  details?: ErrorDetails
): { 
  success: boolean; 
  error: { 
    message: string; 
    status: number; 
    details?: ErrorDetails;
    timestamp: string;
  } 
} {
  return {
    success: false,
    error: {
      message,
      status,
      ...(details && { details }),
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Creates a standardized validation error response
 * @param {Record<string, string[]>} errors - Object containing field validation errors
 * @param {string} [message='Validation failed'] - Error message
 * @returns {Object} Standardized validation error response
 */
export function createValidationErrorResponse(
  errors: Record<string, string[]>,
  message = 'Validation failed'
): { 
  success: false; 
  error: { 
    message: string; 
    status: number; 
    details: ValidationErrorDetails;
    timestamp: string;
  } 
} {
  return {
    success: false,
    error: {
      message,
      status: 400,
      details: { validation: errors },
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Creates a paginated response object
 * @template T - Type of the items in the paginated data
 * @param {T[]} items - Array of items for the current page
 * @param {number} total - Total number of items available
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @param {string} [message='Success'] - Success message
 * @returns {PaginatedResponse<T>} Paginated response object
 */
export function createPaginatedResponse<T>(
  items: T[], 
  total: number, 
  page: number, 
  limit: number, 
  message = 'Success'
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    ...createSuccessResponse(items, message),
    pagination: {
      total,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
}

/**
 * Type guard to check if an error is an instance of Error
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is an instance of Error
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}
