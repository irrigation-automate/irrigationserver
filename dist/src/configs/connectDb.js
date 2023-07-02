"use strict";
// ==============================|| package, variables and functions ||============================== //
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDB = void 0;
// ======|| import connect to mongodb
const mongodb_1 = require("mongodb");
// ======|| import envirement variables
const envirementVariables_1 = require("./envirementVariables");
// === destractions of mongodb envirement variables
const { mongoDbDatabase, mongoDbPassword, mongoDbUserName } = envirementVariables_1.enirementVariables.mongoDbConfig;
// --- create mongodb url connection
const url = `mongodb+srv://${mongoDbUserName}:${mongoDbPassword}@cluster0.ywnsq.mongodb.net/${mongoDbDatabase}?retryWrites=true&w=majority`;
// ==============================|| Connect to mongodb Atlas database function ||============================== //
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        // ======|| instance service
        const client = new mongodb_1.MongoClient(url);
        try {
            // Connect to the MongoDB server
            yield client.connect();
            // message to return
            return { message: 'connect to database done with success' };
        }
        catch (err) {
            // see error at console for details
            console.error(err);
            // message error to return
            return { message: 'connent to database is failed' };
        }
    });
}
exports.connectToMongoDB = connectToMongoDB;
