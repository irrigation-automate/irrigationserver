import app from '.';
import { connectToMongoDB } from './src/configs/connectDb';

const port = process.env.PORT;

async function startServer() {
  try {
    const dbConnect = await connectToMongoDB();
    console.log(dbConnect.message);
    app.listen(port, () => {
      return console.log('server connect with success at port', port);
    });
  } catch (error) {
    throw new Error('cannot connect to the server');
  }
}
  
startServer();