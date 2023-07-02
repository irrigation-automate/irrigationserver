// ==============================|| envirement variables collections types ||============================== //

// ======|| database envirement variables type
export type TmongoDbConfig = {
    mongoDbUserName: string | undefined;
    mongoDbPassword: string | undefined;
    mongoDbDatabase: string | undefined;
}

// ======|| server envirement variables type
export type TserverConfig = {
  PORT: string | undefined;
}

// ======|| jwt envirement variables type
export type TjwtConfig = {
  JWTSecret: string | undefined;
}