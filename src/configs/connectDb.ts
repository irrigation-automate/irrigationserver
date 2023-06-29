import { MongoClient } from 'mongodb';
import {enirementVariables} from './envirementVariables';

const {mongoDbDatabase, mongoDbPassword, mongoDbUserName} = enirementVariables.mongoDbConfig;

const url = `mongodb+srv://${mongoDbUserName}:${mongoDbPassword}@cluster0.ywnsq.mongodb.net/${mongoDbDatabase}?retryWrites=true&w=majority`;

export async function connectToMongoDB() : Promise<{message: string}> {
  const client = new MongoClient(url);
  try {
    // Connect to the MongoDB server
    await client.connect();
    return {message: 'connect to database done with success'};
  } catch (err) {
    console.error( err);
    return {message: 'connent to database is failed'};
  }
}