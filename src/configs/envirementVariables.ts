/**
 * @module config/envirementVariables
 * @description Environment variables configuration and type definitions.
 * This module handles loading and typing environment variables for the application.
 */

import { TjwtConfig, TmongoDbConfig, TserverConfig } from '../interface/types/configEnvirements';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment variables loaded from process.env
 * @constant
 * @type {Object}
 * @property {string} PORT - The port number the server will listen on
 * @property {string} mongoDbUserName - MongoDB username for authentication
 * @property {string} mongoDbPassword - MongoDB password for authentication
 * @property {string} mongoDbDatabase - Name of the MongoDB database
 * @property {string} JWTSecret - Secret key for JWT token generation and verification
 */
const { PORT, mongoDbUserName, mongoDbPassword, mongoDbDatabase, JWTSecret } = process.env;

// Validate required environment variables
const requiredEnvVars = {
  PORT,
  mongoDbUserName,
  mongoDbPassword,
  mongoDbDatabase,
  JWTSecret,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => value === undefined)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

/**
 * Server configuration object
 * @type {TserverConfig}
 */
const serverConfig: TserverConfig = {
  PORT: parseInt(PORT as string, 10) || 5001,
};

/**
 * MongoDB connection configuration
 * @type {TmongoDbConfig}
 */
const mongoDbConfig: TmongoDbConfig = {
  mongoDbUserName: mongoDbUserName as string,
  mongoDbPassword: mongoDbPassword as string,
  mongoDbDatabase: mongoDbDatabase as string,
};

/**
 * JWT authentication configuration
 * @type {TjwtConfig}
 */
const JWTConfig: TjwtConfig = {
  JWTSecret: JWTSecret as string,
};

/**
 * Consolidated environment variables object
 * @constant
 * @type {Object}
 * @property {TserverConfig} serverConfig - Server configuration
 * @property {TmongoDbConfig} mongoDbConfig - MongoDB configuration
 * @property {TjwtConfig} JWTConfig - JWT configuration
 */
export const enirementVariables = {
  serverConfig,
  mongoDbConfig,
  JWTConfig,
} as const;
