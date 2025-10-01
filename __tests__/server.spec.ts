/**
 * @file Server module tests
 * @description Unit tests for the server module, including `startServer` and shutdown handling.
 * @group Unit Tests/Server
 */

import {
  flushPromises,
  mockMongoSuccess,
  mockMongoFailure,
  mockMongoError,
  defaultPort,
} from './helper/serverTestHelpers';

/**
 * Mock Express app with `listen` and `close` methods.
 * Used to intercept server startup and simulate shutdown.
 */
export const mockApp = {
  listen: jest.fn((port: number, callback?: () => void) => {
    if (callback) callback();
    return { close: jest.fn((cb?: () => void) => cb && cb()) };
  }),
};

jest.mock('../src/index', () => mockApp);

import { startServer } from '../src/server';

/**
 * Mock `process.exit` to prevent actual termination during tests.
 */
const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  return undefined as never;
});

/**
 * Mock console methods to capture logs and errors during tests.
 */
const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
};
const originalConsole = { ...console };

beforeAll(() => {
  global.console = { ...originalConsole, ...mockConsole };
});

afterAll(() => {
  global.console = originalConsole;
  mockProcessExit.mockRestore();
});

describe('Server Module', () => {
  /**
   * Captured process signal handlers for testing shutdown sequences.
   */
  let signalHandlers: Record<string, () => void> = {};

  beforeEach(() => {
    jest.clearAllMocks();

    signalHandlers = {};
    jest.spyOn(process, 'on').mockImplementation((signal: string | symbol, fn: () => void) => {
      if (typeof signal === 'string') {
        signalHandlers[signal] = fn;
      }
      return process;
    });
  });

  /**
   * Tests for the `startServer` function.
   */
  describe('startServer', () => {
    it('should start the server successfully with default port', async () => {
      mockMongoSuccess();
      await startServer();

      expect(mockApp.listen).toHaveBeenCalledWith(defaultPort, expect.any(Function));
      expect(mockConsole.log).toHaveBeenCalledWith('✅', 'Connected to MongoDB');
      expect(mockConsole.log).toHaveBeenCalledWith(`🚀 Server is running on port ${defaultPort}`);
    });

    it('should handle MongoDB connection failure', async () => {
      mockMongoFailure('Failed to connect');

      await startServer().catch(() => null);

      expect(mockProcessExit).toHaveBeenCalledWith(1);
      expect(mockConsole.error).toHaveBeenCalledWith(
        '❌ Failed to start server:',
        'Failed to connect to MongoDB: Failed to connect',
      );
    });

    it('should handle MongoDB connection error', async () => {
      mockMongoError(new Error('Connection error'));

      await startServer().catch(() => null);

      expect(mockProcessExit).toHaveBeenCalledWith(1);
      expect(mockConsole.error).toHaveBeenCalledWith(
        '❌ Failed to start server:',
        'Connection error',
      );
    });
  });

  /**
   * Tests for server shutdown handling via signals.
   */
  describe('shutdown', () => {
    it('should handle SIGTERM signal', async () => {
      mockMongoSuccess();
      await startServer();

      mockConsole.log.mockClear();

      signalHandlers['SIGTERM']?.();
      await flushPromises();

      expect(mockConsole.log).toHaveBeenCalledWith('🛑 Shutting down server...');
      expect(mockConsole.log).toHaveBeenCalledWith('🛑 Server closed');
    });
  });
});
