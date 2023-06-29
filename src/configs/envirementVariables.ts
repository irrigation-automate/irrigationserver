import dotenv from 'dotenv';

dotenv.config();
type TmongoDbConfig = {
    mongoDbUserName: string | undefined;
    mongoDbPassword: string | undefined;
    mongoDbDatabase: string | undefined;
}

type TserverConfig = {
  PORT: string | undefined;
}

type TjwtConfig = {
  JWTSecret: string | undefined;
}
const {
  PORT,
  mongoDbUserName,
  mongoDbPassword,
  mongoDbDatabase,
  JWTSecret
} = process.env;

const serverConfig: TserverConfig ={
  PORT
};

const mongoDbConfig : TmongoDbConfig = {
  mongoDbUserName,
  mongoDbPassword,
  mongoDbDatabase
};
const JWTConfig: TjwtConfig = {
  JWTSecret
};

export const enirementVariables = {
  serverConfig,
  mongoDbConfig,
  JWTConfig
};