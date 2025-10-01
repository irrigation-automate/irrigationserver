/**
 * @module config/connectDb
 * @description MongoDB connection configuration and utilities.
 * This module handles the connection to MongoDB Atlas and provides a reusable client.
 */

import { MongoClient, MongoClientOptions, Db } from 'mongodb';
import { enirementVariables } from './envirementVariables';

/**
 * MongoDB connection URL constructed from environment variables
 * @constant
 * @type {string}
 */
const { mongoDbDatabase, mongoDbPassword, mongoDbUserName } = enirementVariables.mongoDbConfig;
const url = `mongodb+srv://${mongoDbUserName}:${mongoDbPassword}@cluster0.ywnsq.mongodb.net/${mongoDbDatabase}?retryWrites=true&w=majority`;

/**
 * MongoDB client options
 * @constant
 * @type {MongoClientOptions}
 */
const clientOptions: MongoClientOptions = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority',
};

/**
 * Establishes a connection to the MongoDB Atlas database
 * @async
 * @function connectToMongoDB
 * @returns {Promise<{success: boolean; message: string; db?: Db; client?: MongoClient}>} Connection result with status and optional database client
 *
 * @example
 * const { success, message, db, client } = await connectToMongoDB();
 * if (success) {
 *   // Use db for database operations
 *   const result = await db.collection('users').find({}).toArray();
 *   // Don't forget to close the connection when done
 *   await client.close();
 * }
 */
export async function connectToMongoDB(): Promise<{
  success: boolean;
  message: string;
  db?: Db;
  client?: MongoClient;
}> {
  const client = new MongoClient(url, clientOptions);

  try {
    await client.connect();

    await client.db(mongoDbDatabase).command({ ping: 1 });

    return {
      success: true,
      message: 'Successfully connected to MongoDB',
      db: client.db(mongoDbDatabase),
      client,
    };
  } catch (error) {
    console.error('MongoDB connection error:', error);

    try {
      await client.close();
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to connect to MongoDB',
    };
  }
}
