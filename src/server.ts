/**
 * @module server
 * @description Main server entry point.
 * This module initializes the Express application and establishes a connection to MongoDB.
 */

import app from './index';
import { connectToMongoDB } from './configs/connectDb';
import { enirementVariables } from './configs/envirementVariables';

/**
 * Starts the Express server and establishes a connection to MongoDB.
 * @async
 * @function startServer
 * @param {number} [port] - Optional port number to use (defaults to environment variable)
 * @returns {Promise<{server: any, db: any, client: any}>} Server, database, and client instances
 * @throws {Error} If the server fails to start or connect to the database
 */
export async function startServer(port?: number): Promise<{ server: any; db: any; client: any }> {
  try {
    const { success, message, db, client } = await connectToMongoDB();

    if (!success || !db || !client) {
      throw new Error(`Failed to connect to MongoDB: ${message}`);
    }

    console.log('✅', message);

    const serverPort = port || enirementVariables.serverConfig.PORT;

    const server = app.listen(serverPort, () => {
      console.log(`🚀 Server is running on port ${serverPort}`);
    });

    const shutdown = async (): Promise<void> => {
      console.log('🛑 Shutting down server...');

      server.close(async () => {
        console.log('🛑 Server closed');

        try {
          if (client && typeof client.close === 'function') {
            await client.close();
            console.log('🛑 MongoDB connection closed');
          }
          process.exit(0);
        } catch (error) {
          console.error('Error closing MongoDB connection:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    return { server, db, client };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Failed to start server:', errorMessage);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('❌ Fatal error during server startup:', error);
    process.exit(1);
  });
}
