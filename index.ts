import express, { Express } from 'express';
import dotenv from 'dotenv';
import { getTestData } from './src/Routes/tests/testController';
import cors from 'cors';
import { setupSwagger } from './src/utils/swagger';

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/test', getTestData);

// Swagger documentation
if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

export default app;