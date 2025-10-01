/**
 * @fileoverview Test suite for MongoDB connection configuration.
 * @description
 * This file contains unit tests for the MongoDB connection utility.
 * It mocks the MongoDB client to simulate successful and failed connections
 * without requiring a live MongoDB instance.
 *
 * @module tests/configs/connectDb.test
 */
import { connectToMongoDB } from '../../src/configs/connectDb';

/**
 * Mock environment variables for MongoDB credentials.
 */
jest.mock('../../src/configs/envirementVariables', () => ({
  enirementVariables: {
    mongoDbConfig: {
      mongoDbUserName: 'testuser',
      mongoDbPassword: 'testpass',
      mongoDbDatabase: 'testdb',
    },
  },
}));

/**
 * Mock database object with minimal functionality.
 */
const mockDb = {
  databaseName: 'testdb',
  command: jest.fn().mockResolvedValue({ ok: 1 }),
};

/**
 * Mock MongoDB client with stubbed methods.
 */
const mockClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  db: jest.fn().mockReturnValue(mockDb),
  close: jest.fn().mockResolvedValue(undefined),
};

jest.mock('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => mockClient),
}));

const mockConnect = mockClient.connect as jest.Mock;
const mockDbFn = mockClient.db as jest.Mock;
const mockClose = mockClient.close as jest.Mock;
const mockCommand = mockDb.command as jest.Mock;

/**
 * Test suite for MongoDB connection logic.
 */
describe('MongoDB Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Unit tests for the `connectToMongoDB` function.
   */
  describe('connectToMongoDB', () => {
    /**
     * Should successfully establish a connection to MongoDB and return the client + database.
     */
    it('should successfully connect to MongoDB', async () => {
      mockConnect.mockResolvedValueOnce(undefined);
      mockCommand.mockResolvedValueOnce({ ok: 1 });

      const { success, message, db, client } = await connectToMongoDB();

      expect(success).toBe(true);
      expect(message).toBe('Successfully connected to MongoDB');
      expect(db).toBeDefined();
      expect(client).toBeDefined();

      expect(mockConnect).toHaveBeenCalled();
      expect(mockDbFn).toHaveBeenCalledWith('testdb');
      expect(mockCommand).toHaveBeenCalledWith({ ping: 1 });
    });

    /**
     * Should return the database object with the expected `databaseName`.
     */
    it('should return the database with the correct name', async () => {
      mockConnect.mockResolvedValueOnce(undefined);
      mockCommand.mockResolvedValueOnce({ ok: 1 });

      const { success, db } = await connectToMongoDB();

      expect(success).toBe(true);
      expect(db).toBeDefined();
      expect(db?.databaseName).toBe('testdb');
    });

    /**
     * Should handle errors during connection initialization and return a failure result.
     */
    it('should handle connection errors', async () => {
      const mockError = new Error('Connection failed');
      mockConnect.mockRejectedValueOnce(mockError);

      const originalError = console.error;
      console.error = jest.fn();

      const { success, message } = await connectToMongoDB();

      expect(success).toBe(false);
      expect(message).toContain('Connection failed');
      expect(mockConnect).toHaveBeenCalled();

      console.error = originalError;
    });

    /**
     * Should close the client gracefully if a connection error occurs after initial connection.
     */
    it('should close the client on connection error', async () => {
      mockConnect.mockResolvedValueOnce(undefined);
      mockCommand.mockRejectedValueOnce(new Error('Ping failed'));

      const originalError = console.error;
      console.error = jest.fn();

      const { success } = await connectToMongoDB();

      expect(success).toBe(false);
      expect(mockClose).toHaveBeenCalled();

      console.error = originalError;
    });
  });
});
