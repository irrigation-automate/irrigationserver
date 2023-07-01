"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enirementVariables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PORT, mongoDbUserName, mongoDbPassword, mongoDbDatabase, JWTSecret } = process.env;
const serverConfig = {
    PORT
};
const mongoDbConfig = {
    mongoDbUserName,
    mongoDbPassword,
    mongoDbDatabase
};
const JWTConfig = {
    JWTSecret
};
exports.enirementVariables = {
    serverConfig,
    mongoDbConfig,
    JWTConfig
};
