import express, { Express } from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB } from './src/configs/connectDb';
import { getTestData } from './src/Routes/tests/testController';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use('/test', getTestData);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

connectToMongoDB().then(response => console.log(response.message)).catch(error => console.log(error));

export default app;