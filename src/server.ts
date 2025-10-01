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
 * @returns {Promise<void>}
 * @throws {Error} If the server fails to start or connect to the database
 */
async function startServer(): Promise<void> {
  try {
    // Attempt to connect to MongoDB
    const { success, message, db, client } = await connectToMongoDB();
    
    if (!success || !db || !client) {
      throw new Error(`Failed to connect to MongoDB: ${message}`);
    }
    
    console.log('✅', message);
    
    // Start the Express server
    const server = app.listen(enirementVariables.serverConfig.PORT, () => {
      console.log(`🚀 Server is running on port ${enirementVariables.serverConfig.PORT}`);
    });
    
    // Handle graceful shutdown
    const shutdown = async (): Promise<void> => {
      console.log('🛑 Shutting down server...');
      
      // Close the server
      server.close(async () => {
        console.log('🛑 Server closed');
        
        // Close MongoDB connection
        try {
          await client.close();
          console.log('🛑 MongoDB connection closed');
          process.exit(0);
        } catch (error) {
          console.error('Error closing MongoDB connection:', error);
          process.exit(1);
        }
      });
    };
    
    // Handle termination signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Failed to start server:', errorMessage);
    process.exit(1);
  }
}

// Start the server
startServer().catch((error) => {
  console.error('❌ Fatal error during server startup:', error);
  process.exit(1);
});