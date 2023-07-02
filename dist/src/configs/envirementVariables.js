"use strict";
// ==============================|| package, variables and functions ||============================== //
// ======|| import types of configuration variables
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enirementVariables = void 0;
// ======|| import dotenv package to unlock envirement variabele
const dotenv_1 = __importDefault(require("dotenv"));
// ======|| loads envirement variables
dotenv_1.default.config();
// ======|| import envirement variables
const { PORT, mongoDbUserName, mongoDbPassword, mongoDbDatabase, JWTSecret } = process.env;
// ======|| server envirement variables
const serverConfig = {
    PORT
};
// ======|| database envirement variables
const mongoDbConfig = {
    mongoDbUserName,
    mongoDbPassword,
    mongoDbDatabase
};
// ======|| jwt envirement variables
const JWTConfig = {
    JWTSecret
};
// ==============================|| export variables envirements ||============================== //
exports.enirementVariables = {
    serverConfig,
    mongoDbConfig,
    JWTConfig
};
