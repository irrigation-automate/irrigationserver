"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const connectDb_1 = require("./src/configs/connectDb");
const envirementVariables_1 = require("./src/configs/envirementVariables");
async function startServer() {
    try {
        const dbConnect = await (0, connectDb_1.connectToMongoDB)();
        console.log(dbConnect.message);
        _1.default.listen(envirementVariables_1.enirementVariables.serverConfig.PORT, () => {
            return console.log('server connect with success at port', envirementVariables_1.enirementVariables.serverConfig.PORT);
        });
    }
    catch (error) {
        throw new Error('cannot connect to the server');
    }
}
startServer();
//# sourceMappingURL=server.js.map