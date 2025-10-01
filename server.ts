import app from '.';
import { connectToMongoDB } from './src/configs/connectDb';
import { enirementVariables } from './src/configs/envirementVariables';


async function startServer() {
  try {
    const dbConnect = await connectToMongoDB();
    console.log(dbConnect.message);
    app.listen(enirementVariables.serverConfig.PORT, () => {
      return console.log('server connect with success at port', enirementVariables.serverConfig.PORT);
    });
  } catch (error) {
    throw new Error('cannot connect to the server');
  }
}
  
startServer();