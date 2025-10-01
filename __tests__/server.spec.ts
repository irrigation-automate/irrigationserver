/**
 * @file Test suite for the server module
 * @group Unit Tests/Server
 */

// Mock the Express app first
const mockApp = {
  listen: jest.fn((port, callback) => {
    if (typeof callback === 'function') {
      callback();
    }
    return {
      close: jest.fn((callback) => {
        if (typeof callback === 'function') {
          callback();
        }
      }),
    };
  }),
};

// Mock the default export of the index module before importing anything that uses it
jest.mock('../src/index', () => mockApp);

// Now import the required modules
import { startServer } from '../src/server';
import { connectToMongoDB } from '../src/configs/connectDb';
import { enirementVariables } from '../src/configs/envirementVariables';

// Mock the required modules
jest.mock('../src/configs/connectDb');

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
  return (code: number) => {
    // Don't actually exit, just throw an error for testing
    throw new Error(`Process exited with code ${code}`);
  };
}) as any);

// Mock console methods for cleaner test output
const originalConsole = { ...console };
const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
};

global.console = {
  ...originalConsole,
  ...mockConsole,
};

// Mock process signals
const originalProcessOn = process.on;
const originalProcessOff = process.off;
const originalProcessRemoveListener = process.removeListener;
let signalHandlers: { [key: string]: (...args: unknown[]) => void } = {};
// Helper function to wait for promises to resolve
const flushPromises = () => new Promise(setImmediate);

beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();

  // Reset process.on mock
  (process.on as jest.Mock) = jest.fn(
    (signal: NodeJS.Signals, handler: (...args: unknown[]) => void) => {
      signalHandlers[signal] = handler;
      return process;
    },
  );

  // Reset signal handlers
  signalHandlers = {};
});

afterAll(() => {
  // Restore original methods
  process.on = originalProcessOn;
  process.off = originalProcessOff;
  process.removeListener = originalProcessRemoveListener;

  // Restore console
  global.console = originalConsole;

  // Restore process.exit
  mockExit.mockRestore();
});

describe('Server', () => {
  // Mock MongoDB client and database
  const mockClient = {
    close: jest.fn().mockResolvedValue(undefined),
  };

  const mockDb = {
    // Add any necessary database methods here
  };

  describe('startServer', () => {
    it('should start the server successfully with default port', async () => {
      // Mock successful MongoDB connection
      (connectToMongoDB as jest.Mock).mockResolvedValueOnce({
        success: true,
        message: 'Connected to MongoDB',
        db: mockDb,
        client: mockClient,
      });

      await startServer();

      // Verify MongoDB connection was attempted
      expect(connectToMongoDB).toHaveBeenCalled();

      // Verify server started with default port
      expect(mockApp.listen).toHaveBeenCalledWith(
        enirementVariables.serverConfig.PORT,
        expect.any(Function),
      );

      // Verify success message was logged
      expect(console.log).toHaveBeenCalledWith('✅', 'Connected to MongoDB');
      expect(console.log).toHaveBeenCalledWith(
        `🚀 Server is running on port ${enirementVariables.serverConfig.PORT}`,
      );
    });

    it('should handle MongoDB connection failure', async () => {
      // Mock failed MongoDB connection
      const errorMessage = 'Connection failed';
      (connectToMongoDB as jest.Mock).mockResolvedValueOnce({
        success: false,
        message: errorMessage,
      });

      // Mock process.exit to prevent actual exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
        // Don't throw here, just return to continue test execution
        return undefined as never;
      }) as any);

      await startServer();

      // Verify process.exit was called with error code 1
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        '❌ Failed to start server:',
        `Failed to connect to MongoDB: ${errorMessage}`,
      );

      // Verify server did not start
      expect(mockApp.listen).not.toHaveBeenCalled();

      // Clean up
      mockExit.mockRestore();
    });

    it('should handle MongoDB connection error', async () => {
      // Mock error during MongoDB connection
      const error = new Error('Connection error');
      (connectToMongoDB as jest.Mock).mockRejectedValueOnce(error);

      // Mock process.exit to prevent actual exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
        // Don't throw here, just return to continue test execution
        return undefined as never;
      }) as any);

      await startServer();

      // Verify process.exit was called with error code 1
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith('❌ Failed to start server:', 'Connection error');

      // Verify server did not start
      expect(mockApp.listen).not.toHaveBeenCalled();

      // Clean up
      mockExit.mockRestore();
    });

    it('should handle server startup errors', async () => {
      // Mock successful MongoDB connection but error during server startup
      (connectToMongoDB as jest.Mock).mockResolvedValueOnce({
        success: true,
        message: 'Connected to MongoDB',
        db: mockDb,
        client: mockClient,
      });

      // Mock error during server startup
      const error = new Error('Server error');
      mockApp.listen.mockImplementationOnce(() => {
        throw error;
      });

      // Mock process.exit to prevent actual exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
        // Don't throw here, just return to continue test execution
        return undefined as never;
      }) as any);

      await startServer();

      // Verify process.exit was called with error code 1
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith('❌ Failed to start server:', 'Server error');

      // Clean up
      mockExit.mockRestore();
    });
  });

  describe('shutdown', () => {
    it('should handle SIGTERM signal', async () => {
      // Mock successful MongoDB connection
      (connectToMongoDB as jest.Mock).mockResolvedValueOnce({
        success: true,
        message: 'Connected to MongoDB',
        db: mockDb,
        client: mockClient,
      });

      // Mock process.exit to prevent actual exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
        // Don't throw here, just return to continue test execution
        return undefined as never;
      }) as any);

      await startServer();

      // Reset mocks to clear any calls from startServer
      (console.log as jest.Mock).mockClear();

      // Trigger SIGTERM and wait for promises to resolve
      signalHandlers['SIGTERM']();
      await flushPromises();

      // Verify shutdown sequence
      expect(console.log).toHaveBeenCalledWith('🛑 Shutting down server...');
      expect(console.log).toHaveBeenCalledWith('🛑 Server closed');

      // Clean up
      mockExit.mockRestore();
    });

    it('should handle SIGINT signal', async () => {
      // Mock successful MongoDB connection
      (connectToMongoDB as jest.Mock).mockResolvedValueOnce({
        success: true,
        message: 'Connected to MongoDB',
        db: mockDb,
        client: mockClient,
      });

      // Mock process.exit to prevent actual exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
        // Don't throw here, just return to continue test execution
        return undefined as never;
      }) as any);

      await startServer();

      // Reset mocks to clear any calls from startServer
      (console.log as jest.Mock).mockClear();

      // Trigger SIGINT and wait for promises to resolve
      signalHandlers['SIGINT']();
      await flushPromises();

      // Verify shutdown sequence
      expect(console.log).toHaveBeenCalledWith('🛑 Shutting down server...');
      expect(console.log).toHaveBeenCalledWith('🛑 Server closed');

      // Clean up
      mockExit.mockRestore();
    });

    it('should handle errors during MongoDB disconnection', async () => {
      // Mock successful MongoDB connection
      const error = new Error('Disconnection error');
      mockClient.close.mockRejectedValueOnce(error);

      (connectToMongoDB as jest.Mock).mockResolvedValueOnce({
        success: true,
        message: 'Connected to MongoDB',
        db: mockDb,
        client: mockClient,
      });

      // Mock process.exit to prevent actual exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {
        // Don't throw here, just return to continue test execution
        return undefined as never;
      }) as any);

      await startServer();

      // Reset mocks to clear any calls from startServer
      (console.error as jest.Mock).mockClear();

      // Trigger SIGTERM and wait for promises to resolve
      signalHandlers['SIGTERM']();
      await flushPromises();

      // Verify error handling
      expect(console.error).toHaveBeenCalledWith(
        'Error closing MongoDB connection:',
        expect.any(Error),
      );

      // Clean up
      mockExit.mockRestore();
    });
  });
});
