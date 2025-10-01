import healthService from '../../src/Services/health.service';
import mongoose from 'mongoose';

/**
 * Mock mongoose module for testing database connectivity.
 * Provides `ping` and `admin` mocks to simulate DB responses.
 */
jest.mock('mongoose', () => {
  const mockPing = jest.fn();
  const mockAdmin = jest.fn().mockImplementation(() => ({ ping: mockPing }));

  const mockDb = { admin: mockAdmin };

  return {
    connection: {
      readyState: 1,
      db: mockDb
    },
    __mockPing: mockPing,
    __mockAdmin: mockAdmin
  };
});

describe('Health Service', () => {
  const mockPing = (mongoose as any).__mockPing;
  const mockAdmin = (mongoose as any).__mockAdmin;

  /**
   * Helper function to set mongoose connection readyState.
   * @param state Ready state number (0 = disconnected, 1 = connected)
   */
  const setReadyState = (state: number) => {
    Object.defineProperty(mongoose.connection, 'readyState', {
      value: state,
      writable: true
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setReadyState(1);
    mockPing.mockReset();
    mockAdmin.mockReset();
    mockAdmin.mockReturnValue({ ping: mockPing });
  });

  /**
   * Tests for `checkDatabaseConnection` method.
   */
  describe('checkDatabaseConnection', () => {
    it('should return connected status when database is available', async () => {
      mockPing.mockResolvedValue(true);

      const result = await healthService.checkDatabaseConnection();

      expect(result).toEqual({
        connected: true,
        duration: expect.any(Number)
      });
      expect(result.duration).toBeGreaterThanOrEqual(0);
      expect(mockPing).toHaveBeenCalled();
    });

    it('should return disconnected status when mongoose is not connected', async () => {
      setReadyState(0);

      const result = await healthService.checkDatabaseConnection();

      expect(result).toEqual({
        connected: false,
        duration: expect.any(Number),
        error: 'Mongoose not connected'
      });
      expect(mockPing).not.toHaveBeenCalled();
    });

    it('should handle database ping errors', async () => {
      const errorMessage = 'Connection failed';
      mockPing.mockRejectedValue(new Error(errorMessage));

      const result = await healthService.checkDatabaseConnection();

      expect(result).toEqual({
        connected: false,
        duration: expect.any(Number),
        error: errorMessage
      });
      expect(mockPing).toHaveBeenCalled();
    });
  });

  /**
   * Tests for `getMemoryUsage` method.
   */
  describe('getMemoryUsage', () => {
    it('should return memory usage in MB', () => {
      const mockMemoryUsage = {
        rss: 1024 * 1024 * 100,      // 100 MB
        heapTotal: 1024 * 1024 * 50, // 50 MB
        heapUsed: 1024 * 1024 * 30,  // 30 MB
        external: 1024 * 1024 * 20,  // 20 MB
        arrayBuffers: 0               // added to satisfy NodeJS.MemoryUsage
      } as NodeJS.MemoryUsage;

      jest.spyOn(process, 'memoryUsage').mockReturnValue(mockMemoryUsage);

      const result = healthService.getMemoryUsage();

      expect(result).toEqual({
        rss: '100.00 MB',
        heapTotal: '50.00 MB',
        heapUsed: '30.00 MB',
        external: '20.00 MB'
      });
    });
  });

  /**
   * Tests for `getUptime` method.
   */
  describe('getUptime', () => {
    it('should return process uptime in seconds', () => {
      const mockUptime = 12345;
      jest.spyOn(process, 'uptime').mockReturnValue(mockUptime);

      const result = healthService.getUptime();

      expect(result).toBe(mockUptime);
    });
  });

  /**
   * Tests for `getCurrentTimestamp` method.
   */
  describe('getCurrentTimestamp', () => {
    it('should return current timestamp in ISO format', () => {
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = healthService.getCurrentTimestamp();

      expect(result).toBe(mockDate.toISOString());
    });
  });
});
