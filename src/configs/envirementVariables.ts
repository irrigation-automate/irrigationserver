// ==============================|| package, variables and functions ||============================== //
// ======|| import types of configuration variables

import { TjwtConfig, TmongoDbConfig, TserverConfig } from '../interface/types/configEnvirements';

// ======|| import dotenv package to unlock envirement variabele
import dotenv from 'dotenv';

// ======|| loads envirement variables
dotenv.config();

// ======|| import envirement variables
const {
  PORT,
  mongoDbUserName,
  mongoDbPassword,
  mongoDbDatabase,
  JWTSecret
} = process.env;

// ======|| server envirement variables
const serverConfig: TserverConfig = {
  PORT
};

// ======|| database envirement variables
const mongoDbConfig : TmongoDbConfig = {
  mongoDbUserName,
  mongoDbPassword,
  mongoDbDatabase
};

// ======|| jwt envirement variables
const JWTConfig: TjwtConfig = {
  JWTSecret
};

// ==============================|| export variables envirements ||============================== //
export const enirementVariables = {
  serverConfig,
  mongoDbConfig,
  JWTConfig
};