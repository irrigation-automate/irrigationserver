/**
 * @file Test suite for the Test Controller API endpoints
 * @description
 * Contains integration tests for the test controller endpoints:
 * - GET /api/test - Server status and metadata
 * - GET /api/test/error - Error handling test endpoint
 * - GET /api/test/hello/:name - Greeting endpoint with dynamic parameter
 *
 * Uses supertest for HTTP assertions and testing Express routes.
 *
 * @module tests/controllers/testController.test
 */

import request from 'supertest';
import app from '../src/index';
import * as responseHelpers from '../src/utils/responseHelpers';

jest.mock('../src/utils/responseHelpers', () => {
  const original = jest.requireActual('../src/utils/responseHelpers');
  return {
    ...original,
    createSuccessResponse: jest.fn((...args) => original.createSuccessResponse(...args)),
  };
});

/** Type for the mocked module */
type MockedResponseHelpers = typeof responseHelpers & {
  createSuccessResponse: jest.Mock<ReturnType<typeof responseHelpers.createSuccessResponse>>;
};

/** Cast to our mocked type */
const mockedResponseHelpers = responseHelpers as unknown as MockedResponseHelpers;

/**
 * Test suite for the Test Controller API endpoints.
 *
 * @group Integration Tests
 */
describe('Test Controller', () => {
  /**
   * Mocks the response helpers to throw an error
   */
  const mockResponseHelpersToThrow = () => {
    mockedResponseHelpers.createSuccessResponse.mockImplementation(() => {
      throw new Error('Test error in createSuccessResponse');
    });
  };

  /**
   * Restores the original implementation
   */
  const restoreResponseHelpers = () => {
    mockedResponseHelpers.createSuccessResponse.mockImplementation(
      (data: any, message?: string) => ({
        success: true,
        data,
        message: message || 'Success',
        timestamp: expect.any(String),
      }),
    );
  };

  /** Reset mocks before each test */
  beforeEach(() => {
    jest.clearAllMocks();
    restoreResponseHelpers();
  });

  /**
   * Tests for the `/api/test` endpoint
   *
   * @group API/Test
   */
  describe('GET /api/test', () => {
    /**
     * @test {GET /api/test}
     * Should return server status information with expected structure
     */
    it('should return server status information', async () => {
      const response = await request(app).get('/api/test');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: 'Express + TypeScript Server is running',
          status: 'active',
          version: expect.any(String),
          timestamp: expect.any(String),
        },
      });
    });

    /**
     * @test {GET /api/test}
     * Should handle errors in the getTestData function
     */
    it('should handle errors in getTestData', async () => {
      mockResponseHelpersToThrow();

      const { getTestData } = await import('../src/Routes/tests/testController');

      const mockReq = {} as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const mockNext = jest.fn();

      await getTestData(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockNext.mock.calls[0][0].message).toContain('Test error in createSuccessResponse');

      restoreResponseHelpers();
    });

    it('should return server status information', async () => {
      const response = await request(app).get('/api/test');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: 'Express + TypeScript Server is running',
          status: 'active',
          version: expect.any(String),
          timestamp: expect.any(String),
        },
      });
    });

    /**
     * @test {GET /api/test/error}
     * Should handle and return error responses
     */
    it('should handle errors gracefully', async () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();

      try {
        const response = await request(app).get('/api/test/error');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('message');
        expect(response.body.error.message).toContain('Internal Server Error');
      } finally {
        console.error = originalConsoleError;
      }
    });
  });

  /**
   * Tests for the `/api/test/error` endpoint
   *
   * @group API/Test/Error
   */
  describe('GET /api/test/error', () => {
    /**
     * @test {GET /api/test/error}
     * Should return a test error response
     */
    it('should return a test error', async () => {
      const response = await request(app).get('/api/test/error');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error.message).toContain('Internal Server Error');
    });
  });

  /**
   * Tests for the `/api/test/hello/:name` endpoint
   *
   * @group API/Test/Hello
   */
  describe('GET /api/test/hello/:name', () => {
    /**
     * @test {GET /api/test/hello/:name}
     * Should return a personalized greeting message
     */
    it('should return a greeting with the provided name', async () => {
      const name = 'John';
      const response = await request(app).get(`/api/test/hello/${name}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: `Hello, ${name}!`,
          timestamp: expect.any(String),
        },
      });
    });

    /**
     * @test {GET /api/test/hello/:name}
     * Should correctly handle and include the name parameter in the response
     */
    it('should handle name parameter correctly', async () => {
      const name = 'TestUser';
      const response = await request(app).get(`/api/test/hello/${name}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data.message');
      expect(response.body.data.message).toContain(name);
    });

    /**
     * @test {GET /api/test/hello/:name}
     * Should handle empty or whitespace name parameters gracefully
     */
    it('should handle empty name parameter gracefully', async () => {
      const response1 = await request(app).get('/api/test/hello/');
      expect(response1.status).toBe(404);

      const response2 = await request(app).get('/api/test/hello/%20');
      expect(response2.status).toBe(200);
      expect(response2.body).toHaveProperty('data.message');
      expect(response2.body.data.message).toContain('Hello');

      const response3 = await request(app).get('/api/test/hello/""');
      expect(response3.status).toBe(200);
      expect(response3.body).toHaveProperty('data.message');
      expect(response3.body.data.message).toContain('Hello');
    });

    /**
     * @test {GET /api/test/hello/:name}
     * Should handle missing name parameter in the request
     */
    it('should handle missing name parameter', async () => {
      const mockReq = {
        params: {},
      } as any;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const next = jest.fn();

      /** Import the controller directly to test the function */
      const { getHello } = await import('../src/Routes/tests/testController');
      await getHello(mockReq, mockRes, next);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Name parameter is required',
            status: 400,
          }),
        }),
      );
    });

    /**
     * @test {GET /api/test/hello/:name}
     * Should handle errors in the getHello function
     */
    it('should handle errors in getHello', async () => {
      mockResponseHelpersToThrow();

      const { getHello } = await import('../src/Routes/tests/testController');

      const mockReq = {
        params: { name: 'test' },
      } as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const mockNext = jest.fn();

      await getHello(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockNext.mock.calls[0][0].message).toContain('Test error in createSuccessResponse');

      restoreResponseHelpers();
    });

    it('should return a greeting with the provided name', async () => {
      const name = 'John';
      const response = await request(app).get(`/api/test/hello/${name}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: `Hello, ${name}!`,
          timestamp: expect.any(String),
        },
      });
    });

    it('should handle name parameter correctly', async () => {
      const name = 'TestUser';
      const response = await request(app).get(`/api/test/hello/${name}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data.message');
      expect(response.body.data.message).toContain(name);
    });

    it('should handle empty name parameter gracefully', async () => {
      const response1 = await request(app).get('/api/test/hello/');
      expect(response1.status).toBe(404);

      const response2 = await request(app).get('/api/test/hello/%20');
      expect(response2.status).toBe(200);
      expect(response2.body).toHaveProperty('data.message');
      expect(response2.body.data.message).toContain('Hello');

      const response3 = await request(app).get('/api/test/hello/""');
      expect(response3.status).toBe(200);
      expect(response3.body).toHaveProperty('data.message');
      expect(response3.body.data.message).toContain('Hello');
    });

    it('should handle missing name parameter', async () => {
      const mockReq = {
        params: {},
      } as any;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const next = jest.fn();

      const { getHello } = await import('../src/Routes/tests/testController');
      await getHello(mockReq, mockRes, next);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Name parameter is required',
            status: 400,
          }),
        }),
      );
    });
  });
});
