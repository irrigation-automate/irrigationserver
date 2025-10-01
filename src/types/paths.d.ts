// This file helps TypeScript understand path aliases
// Make sure this file is included in your tsconfig.json's "include" array

declare module '@/index' {
  import { Express } from 'express';
  const expressApp: Express;
  export default expressApp;
}

declare module '@/configs/swagger' {
  import { Express } from 'express';
  export function setupSwagger(_expressApp: Express): void;
}

declare module '@/configs/connectDb' {
  export function connectToMongoDB(): Promise<{
    success: boolean;
    message: string;
  }>;
}

declare module '@/configs/envirementVariables' {
  export const enirementVariables: {
    serverConfig: {
      PORT: string | number;
    };
  };
}
