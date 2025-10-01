/**
 * @fileoverview Test suite for environment variables configuration.
 * @description
 * This file contains unit tests for validating the loading, parsing, and
 * type safety of environment variables used in the application.
 *
 * It ensures that:
 * - Required environment variables are present and parsed correctly.
 * - Missing environment variables throw appropriate errors.
 * - Type safety of the configuration object is enforced at compile-time.
 *
 * @module tests/configs/envirementVariables.test
 */

// Mock the dotenv module to prevent actual file loading during tests
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

/**
 * Stores the original process.env to restore after each test.
 */
const originalEnv = { ...process.env };

/**
 * Helper function to set up the environment variables for testing.
 *
 * @param {Record<string, string>} envVars - The environment variables to set.
 * @returns {EnvirementVariables} - The imported environment configuration module.
 */
const setupTestEnvironment = (envVars: Record<string, string>) => {
  jest.resetModules();
  process.env = { ...envVars };
  return require('../../src/configs/envirementVariables');
};

describe('Environment Variables Configuration', () => {
  afterEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  describe('with valid environment variables', () => {
    const testEnv = {
      PORT: '5001',
      mongoDbUserName: 'testuser',
      mongoDbPassword: 'testpass',
      mongoDbDatabase: 'testdb',
      JWTSecret: 'testsecret',
    };

    it('should correctly parse server configuration', () => {
      const { enirementVariables } = setupTestEnvironment(testEnv);
      expect(enirementVariables.serverConfig).toEqual({
        PORT: 5001,
      });
    });

    it('should correctly parse MongoDB configuration', () => {
      const { enirementVariables } = setupTestEnvironment(testEnv);
      expect(enirementVariables.mongoDbConfig).toEqual({
        mongoDbUserName: 'testuser',
        mongoDbPassword: 'testpass',
        mongoDbDatabase: 'testdb',
      });
    });

    it('should correctly parse JWT configuration', () => {
      const { enirementVariables } = setupTestEnvironment(testEnv);
      expect(enirementVariables.JWTConfig).toEqual({
        JWTSecret: 'testsecret',
      });
    });
  });

  describe('with missing environment variables', () => {
    it('should throw an error when required environment variables are missing', () => {
      const originalError = console.error;
      console.error = jest.fn();

      let error: Error | null = null;
      try {
        setupTestEnvironment({});
      } catch (e) {
        error = e as Error;
      }

      console.error = originalError;

      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(Error);
      if (error) {
        expect(error.message).toMatch(/Missing required environment variables/);
      }
    });
  });

  describe('Type Safety', () => {
    it('should have the correct type for the configuration object', () => {
      const config = {
        serverConfig: {
          PORT: 3000,
        },
        mongoDbConfig: {
          mongoDbUserName: 'test',
          mongoDbPassword: 'test',
          mongoDbDatabase: 'test',
        },
        JWTConfig: {
          JWTSecret: 'test',
        },
      };

      const { enirementVariables } = setupTestEnvironment({
        PORT: '3000',
        mongoDbUserName: 'test',
        mongoDbPassword: 'test',
        mongoDbDatabase: 'test',
        JWTSecret: 'test',
      });

      const typedConfig: typeof enirementVariables = config;
      expect(typedConfig).toBeDefined();
    });
  });
});
