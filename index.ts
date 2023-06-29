import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB } from './src/configs/connectDb';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/test', (req: Request, res: Response) => {
  res.send('Express + TypeScript Servering');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

connectToMongoDB().then(response => console.log(response.message)).catch(error => console.log(error));