"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
const connectDb_1 = require("./src/configs/connectDb");
const port = process.env.PORT;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbConnect = yield connectDb_1.connectToMongoDB();
            console.log(dbConnect.message);
            _1.default.listen(port, () => {
                return console.log('server connect with success at port', port);
            });
        }
        catch (error) {
            throw new Error('cannot connect to the server');
        }
    });
}
startServer();
