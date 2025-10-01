/**
 * @file Server test helpers
 */

import { connectToMongoDB } from '../../src/configs/connectDb';
import { enirementVariables } from '../../src/configs/envirementVariables';

jest.mock('../../src/configs/connectDb');

export const mockDb = {};
export const mockClient = { close: jest.fn().mockResolvedValue(undefined) };

// Mock Express app
export const mockApp = {
  listen: jest.fn((port, callback) => {
    if (callback) callback();
    return { close: jest.fn((cb) => cb && cb()) };
  }),
};

// Mock process.exit
export const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`Process exited with code ${code}`);
});

// Mock console
export const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
};

export const setupConsoleMocks = () => {
  const originalConsole = { ...console };
  global.console = { ...originalConsole, ...mockConsole };
  return () => (global.console = originalConsole);
};

// Capture process signal handlers
export const setupSignalHandlersMock = () => {
  const handlers: Record<string, () => void> = {};
  jest.spyOn(process, 'on').mockImplementation((signal, fn) => {
    handlers[signal as string] = fn as () => void;
    return process;
  });
  return handlers;
};

// Helper to flush pending promises
export const flushPromises = () => new Promise(setImmediate);

// Setup successful MongoDB connection
export const mockMongoSuccess = () => {
  (connectToMongoDB as jest.Mock).mockResolvedValue({
    success: true,
    message: 'Connected to MongoDB',
    db: mockDb,
    client: mockClient,
  });
};

// Setup failed MongoDB connection
export const mockMongoFailure = (message = 'Connection failed') => {
  (connectToMongoDB as jest.Mock).mockResolvedValue({
    success: false,
    message,
  });
};

// Setup MongoDB connection error
export const mockMongoError = (error = new Error('Connection error')) => {
  (connectToMongoDB as jest.Mock).mockRejectedValue(error);
};

// Export default port
export const defaultPort = enirementVariables.serverConfig.PORT;
