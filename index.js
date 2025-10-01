"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const testController_1 = require("./src/Routes/tests/testController");
const cors_1 = __importDefault(require("cors"));
const swagger_1 = require("./src/utils/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use('/test', testController_1.getTestData);
// Swagger documentation
if (process.env.NODE_ENV !== 'production') {
    (0, swagger_1.setupSwagger)(app);
}
exports.default = app;
//# sourceMappingURL=index.js.map