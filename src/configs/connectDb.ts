// ==============================|| package, variables and functions ||============================== //

// ======|| import connect to mongodb
import { MongoClient } from 'mongodb';
// ======|| import envirement variables
import { enirementVariables } from './envirementVariables';

// === destractions of mongodb envirement variables
const { mongoDbDatabase, mongoDbPassword, mongoDbUserName } = enirementVariables.mongoDbConfig;
// --- create mongodb url connection
const url = `mongodb+srv://${mongoDbUserName}:${mongoDbPassword}@cluster0.ywnsq.mongodb.net/${mongoDbDatabase}?retryWrites=true&w=majority`;

// ==============================|| Connect to mongodb Atlas database function ||============================== //

export async function connectToMongoDB() : Promise<{message: string}> {
  // ======|| instance service
  const client = new MongoClient(url);
  try {
    // Connect to the MongoDB server
    await client.connect();
    // message to return
    return { message: 'connect to database done with success' };
  } catch (err) {
    // see error at console for details
    console.error(err);
    // message error to return
    return { message: 'connent to database is failed' };
  }
}