"use strict";
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
const mongodb_1 = require("mongodb");
const envirementVariables_1 = require("./envirementVariables");
const { mongoDbDatabase, mongoDbPassword, mongoDbUserName } = envirementVariables_1.enirementVariables.mongoDbConfig;
const url = `mongodb+srv://${mongoDbUserName}:${mongoDbPassword}@cluster0.ywnsq.mongodb.net/${mongoDbDatabase}?retryWrites=true&w=majority`;
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new mongodb_1.MongoClient(url);
        try {
            // Connect to the MongoDB server
            yield client.connect();
            return { message: 'connect to database done with success' };
        }
        catch (err) {
            console.error(err);
            return { message: 'connent to database is failed' };
        }
    });
}
exports.connectToMongoDB = connectToMongoDB;
