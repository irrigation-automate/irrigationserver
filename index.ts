import express, { Express } from 'express';
import dotenv from 'dotenv';
import { getTestData } from './src/Routes/tests/testController';
import cors from 'cors';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use('/test', getTestData);


export default app;