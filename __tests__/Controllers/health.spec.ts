import request from 'supertest';
import app from '../../src/index';
import mongoose from 'mongoose';
import healthService from '../../src/Services/health.service';

/**
 * Mock the health service methods to control their behavior during tests.
 */
jest.mock('../../src/Services/health.service', () => ({
  checkDatabaseConnection: jest.fn(),
  getMemoryUsage: jest.fn(),
  getUptime: jest.fn(),
  getCurrentTimestamp: jest.fn(),
}));

/**
 * Mock for mongoose database connection and ping.
 */
const mockDb = {
  admin: jest.fn().mockReturnThis(),
  ping: jest.fn(),
};

/**
 * Setup default mocks before each test.
 */
beforeEach(() => {
  (healthService.checkDatabaseConnection as jest.Mock).mockResolvedValue({
    connected: true,
    duration: 10,
  });

  (healthService.getMemoryUsage as jest.Mock).mockReturnValue({
    rss: '100.00 MB',
    heapTotal: '50.00 MB',
    heapUsed: '30.00 MB',
    external: '20.00 MB',
  });

  (healthService.getUptime as jest.Mock).mockReturnValue(3600);
  (healthService.getCurrentTimestamp as jest.Mock).mockReturnValue('2023-01-01T00:00:00.000Z');

  // Mock mongoose connection
  (mongoose.connection as any).readyState = 1;
  (mongoose.connection as any).db = mockDb;
  mockDb.ping.mockResolvedValue(true);
});

/**
 * Test suite for health check endpoints.
 */
describe('Health Check Endpoints', () => {
  /**
   * Tests for the `/health` endpoint.
   */
  describe('GET /health', () => {
    it('should return 200 and detailed health information', async () => {
      const mockHealthData = {
        status: 'UP',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 3600,
        database: { status: 'CONNECTED', responseTime: 10 },
        memory: {
          rss: '100.00 MB',
          heapTotal: '50.00 MB',
          heapUsed: '30.00 MB',
          external: '20.00 MB',
        },
      };

      const response = await request(app).get('/health').set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Health check successful',
        data: mockHealthData,
      });

      expect(response.headers['x-response-time']).toMatch(/\d+ms/);
    });

    it('should return DEGRADED status when database is down', async () => {
      (healthService.checkDatabaseConnection as jest.Mock).mockResolvedValueOnce({
        connected: false,
        duration: 0,
        error: 'Connection failed',
      });

      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('DEGRADED');
      expect(response.body.data.database.status).toBe('ERROR');
      expect(response.body.data.database.error).toBe('Connection failed');
    });
  });

  /**
   * Tests for the `/health/readiness` endpoint.
   */
  describe('GET /health/readiness', () => {
    it('should return 200 when service is ready', async () => {
      (healthService.checkDatabaseConnection as jest.Mock).mockResolvedValueOnce({
        connected: true,
        duration: 5,
      });

      const response = await request(app).get('/health/readiness');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'UP',
        timestamp: '2023-01-01T00:00:00.000Z',
      });
    });

    it('should return 503 when database is not connected', async () => {
      (healthService.checkDatabaseConnection as jest.Mock).mockResolvedValueOnce({
        connected: false,
        duration: 0,
        error: 'Connection failed',
      });

      const response = await request(app).get('/health/readiness');

      expect(response.status).toBe(503);
      expect(response.body).toMatchObject({
        status: 'DOWN',
        timestamp: '2023-01-01T00:00:00.000Z',
        database: { status: 'ERROR', error: 'Connection failed' },
      });
    });
  });

  /**
   * Tests for the `/health/liveness` endpoint.
   */
  describe('GET /health/liveness', () => {
    it('should always return 200', async () => {
      const response = await request(app).get('/health/liveness');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'UP',
        timestamp: '2023-01-01T00:00:00.000Z',
      });
    });
  });

  /**
   * Performance test: response time.
   */
  describe('Response Time', () => {
    it('should respond within 200ms', async () => {
      const start = Date.now();
      await request(app).get('/health');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(200);
    });
  });
});
