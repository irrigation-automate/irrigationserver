import {
  createSuccessResponse,
  createErrorResponse,
  createValidationErrorResponse,
  createPaginatedResponse,
  isError
} from '../../src/utils/responseHelpers';

// Define local types since they're not exported from the module
type ErrorDetails = Record<string, unknown>;
type ValidationErrorDetails = {
  validation: Record<string, string[]>;
};

/**
 * Test suite for utility functions that generate standardized API responses.
 */
/**
 * Test suite for the response helpers utility functions.
 * 
 * @group Unit Tests
 */
describe('Response Helpers', () => {
  // Mock date for consistent testing
  const mockDate = new Date('2023-01-01T00:00:00.000Z');
  const mockDateISO = mockDate.toISOString();

  beforeAll(() => {
    // Mock the global Date object
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterAll(() => {
    // Restore all mocks
    jest.restoreAllMocks();
  });

  afterEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
  });

  /**
   * Tests for createSuccessResponse function
   * 
   * @group Unit Tests/Response Helpers/createSuccessResponse
   */
  describe('createSuccessResponse', () => {
    const testData = { id: 1, name: 'Test' };
    const defaultMessage = 'Success';
    const customMessage = 'Custom success message';

    it('should create a success response with data and default message', () => {
      const response = createSuccessResponse(testData);

      expect(response).toEqual({
        success: true,
        data: testData,
        message: defaultMessage,
        timestamp: mockDateISO
      });
    });

    it('should create a success response with custom message', () => {
      const response = createSuccessResponse(testData, customMessage);

      expect(response).toEqual({
        success: true,
        data: testData,
        message: customMessage,
        timestamp: mockDateISO
      });
    });

    it('should handle null data correctly', () => {
      const response = createSuccessResponse(null);
      expect(response.data).toBeNull();
    });

    it('should handle undefined data correctly', () => {
      const response = createSuccessResponse(undefined);
      expect(response.data).toBeUndefined();
    });

    it('should handle null and undefined data', () => {
      expect(createSuccessResponse(null)).toMatchObject({ success: true, data: null, message: 'Success' });
      expect(createSuccessResponse(undefined)).toMatchObject({ success: true, data: undefined, message: 'Success' });
    });
  });

  /**
   * Tests for createErrorResponse function
   */
  /**
   * Tests for createErrorResponse function
   * 
   * @group Unit Tests/Response Helpers/createErrorResponse
   */
  describe('createErrorResponse', () => {
    const errorMessage = 'An error occurred';
    const statusCode = 400;
    const errorDetails: ErrorDetails = { 
      field: 'email', 
      reason: 'Invalid format' 
    };

    it('should create an error response with default status code', () => {
      const response = createErrorResponse(errorMessage);

      expect(response).toEqual({
        success: false,
        error: {
          message: errorMessage,
          status: 500, // Default status code
          timestamp: mockDateISO
        }
      });
    });

    it('should create an error response with custom status code', () => {
      const response = createErrorResponse(errorMessage, statusCode);

      expect(response).toEqual({
        success: false,
        error: {
          message: errorMessage,
          status: statusCode,
          timestamp: mockDateISO
        }
      });
    });

    it('should include error details when provided', () => {
      const response = createErrorResponse(errorMessage, statusCode, errorDetails);

      expect(response).toEqual({
        success: false,
        error: {
          message: errorMessage,
          status: statusCode,
          details: errorDetails,
          timestamp: mockDateISO
        }
      });
    });

    it('should handle empty error details object', () => {
      const emptyDetails = {};
      const response = createErrorResponse(errorMessage, statusCode, emptyDetails);
      
      expect(response.error.details).toEqual(emptyDetails);
    });
  });

  /**
   * Tests for createValidationErrorResponse function
   */
  /**
   * Tests for createValidationErrorResponse function
   * 
   * @group Unit Tests/Response Helpers/createValidationErrorResponse
   */
  describe('createValidationErrorResponse', () => {
    const validationErrors = {
      email: ['Invalid email format', 'Email is required'],
      password: ['Password is too short', 'Password must contain special characters']
    };
    const defaultMessage = 'Validation failed';
    const customMessage = 'Custom validation error message';

    it('should create a validation error response with custom message', () => {
      const response = createValidationErrorResponse(validationErrors, customMessage);

      expect(response).toEqual({
        success: false,
        error: {
          message: customMessage,
          status: 400,
          details: {
            validation: validationErrors
          },
          timestamp: mockDateISO
        }
      });
    });

    it('should use default message if not provided', () => {
      const response = createValidationErrorResponse(validationErrors);
      expect(response.error.message).toBe(defaultMessage);
    });

    it('should handle empty validation errors object', () => {
      const emptyErrors = {};
      const response = createValidationErrorResponse(emptyErrors);
      
      expect(response.error.details.validation).toEqual(emptyErrors);
    });

    it('should include all validation errors in the response', () => {
      const response = createValidationErrorResponse(validationErrors);
      expect(Object.keys(response.error.details.validation)).toHaveLength(2);
      expect(response.error.details.validation.email).toHaveLength(2);
      expect(response.error.details.validation.password).toHaveLength(2);
    });
  });

  /**
   * Tests for createPaginatedResponse function
   */
  /**
   * Tests for createPaginatedResponse function
   * 
   * @group Unit Tests/Response Helpers/createPaginatedResponse
   */
  describe('createPaginatedResponse', () => {
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ];
    const total = 10;
    const page = 2;
    const limit = 3;
    const defaultMessage = 'Success';
    const customMessage = 'Custom pagination message';

    it('should create a paginated response with default message', () => {
      const response = createPaginatedResponse(items, total, page, limit);
      const totalPages = Math.ceil(total / limit);

      expect(response).toEqual({
        success: true,
        data: items,
        message: defaultMessage,
        timestamp: mockDateISO,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      });
    });

    it('should create a paginated response with custom message', () => {
      const response = createPaginatedResponse(items, total, page, limit, customMessage);
      expect(response.message).toBe(customMessage);
    });

    it('should handle first page correctly', () => {
      const firstPage = 1;
      const response = createPaginatedResponse(items, total, firstPage, limit);

      expect(response.pagination).toMatchObject({
        hasPreviousPage: false,
        hasNextPage: true,
        currentPage: firstPage,
        totalPages: 4
      });
    });

    it('should handle last page correctly', () => {
      const lastPage = 4;
      const response = createPaginatedResponse(items, total, lastPage, limit);

      expect(response.pagination).toMatchObject({
        hasPreviousPage: true,
        hasNextPage: false,
        currentPage: lastPage
      });
    });

    it('should handle empty items array', () => {
      const emptyItems: any[] = [];
      const response = createPaginatedResponse(emptyItems, 0, 1, limit);

      expect(response.data).toHaveLength(0);
      expect(response.pagination).toMatchObject({
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      });
    });

    it('should handle single page of results', () => {
      const singlePageTotal = 2;
      const response = createPaginatedResponse(items.slice(0, 2), singlePageTotal, 1, 10);
      
      expect(response.pagination).toMatchObject({
        total: singlePageTotal,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      });
    });

    it('should handle custom items per page', () => {
      const customLimit = 5;
      const response = createPaginatedResponse(items, total, 1, customLimit);
      
      expect(response.pagination).toMatchObject({
        itemsPerPage: customLimit,
        totalPages: Math.ceil(total / customLimit)
      });
    });
  });

  /**
   * Tests for isError function
   */
  /**
   * Tests for isError type guard
   * 
   * @group Unit Tests/Response Helpers/isError
   */
  describe('isError', () => {
    it('should return true for Error instances', () => {
      const error = new Error('Test error');
      expect(isError(error)).toBe(true);
    });

    it('should return true for custom error types that extend Error', () => {
      class CustomError extends Error {}
      const customError = new CustomError('Custom error');
      expect(isError(customError)).toBe(true);
    });

    it('should return false for non-Error values', () => {
      expect(isError('not an error')).toBe(false);
      expect(isError(123)).toBe(false);
      expect(isError({})).toBe(false);
      expect(isError(null)).toBe(false);
      expect(isError(undefined)).toBe(false);
    });

    it('should narrow the type when used in a type guard', () => {
      const maybeError: unknown = new Error('Test');
      
      if (isError(maybeError)) {
        // TypeScript should know this is an Error here
        expect(maybeError.message).toBe('Test');
      } else {
        fail('Type guard should have identified this as an Error');
      }
    });
  });
});
