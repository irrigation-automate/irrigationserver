"use strict";
// ==============================|| package, variables and functions ||============================== //
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDB = connectToMongoDB;
// ======|| import connect to mongodb
const mongodb_1 = require("mongodb");
// ======|| import envirement variables
const envirementVariables_1 = require("./envirementVariables");
// === destractions of mongodb envirement variables
const { mongoDbDatabase, mongoDbPassword, mongoDbUserName } = envirementVariables_1.enirementVariables.mongoDbConfig;
// --- create mongodb url connection
const url = `mongodb+srv://${mongoDbUserName}:${mongoDbPassword}@cluster0.ywnsq.mongodb.net/${mongoDbDatabase}?retryWrites=true&w=majority`;
// ==============================|| Connect to mongodb Atlas database function ||============================== //
async function connectToMongoDB() {
    // ======|| instance service
    const client = new mongodb_1.MongoClient(url);
    try {
        // Connect to the MongoDB server
        await client.connect();
        // message to return
        return { message: 'connect to database done with success' };
    }
    catch (err) {
        // see error at console for details
        console.error(err);
        // message error to return
        return { message: 'connent to database is failed' };
    }
}
//# sourceMappingURL=connectDb.js.map