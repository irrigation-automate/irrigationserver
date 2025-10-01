/**
 * Global Jest test setup.
 * This file is executed before any test runs, allowing you to configure environment variables,
 * timezones, and global test settings.
 */

/** Set the environment to 'test' to differentiate from development or production */
process.env.NODE_ENV = 'test';

/** Set a fixed timezone to ensure consistent date/time results across tests */
process.env.TZ = 'UTC';

/** Increase Jest default timeout for long-running tests (e.g., integration tests) */
jest.setTimeout(15000); // 15 seconds

/**
 * Runs once before all test suites.
 * Use this for global setup such as connecting to test databases,
 * initializing services, or seeding data.
 */
beforeAll(async () => {});

/**
 * Runs once after all test suites have completed.
 * Use this for cleanup tasks such as closing database connections,
 * clearing caches, or shutting down services.
 */
afterAll(async () => {});
