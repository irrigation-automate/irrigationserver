/**
 * @module index
 * @description Main application entry point.
 * This module configures and initializes the Express application with middleware, routes, and Swagger documentation.
 */

import express, { Express } from "express";
import dotenv from "dotenv";
import { setupSwagger } from "./utils/swagger";
import { I18NEXT } from "./configs/i18n";
import healthRouter from "./Routes/health";
import { CORS } from "./configs/security";
import mainController from "./Controllers/main.controller";
import { responseMiddleware } from "./configs/response.config";

dotenv.config();

/**
 * Express application instance
 * @type {Express}
 */
const app: Express = express();
app.use(express.json());
app.use(CORS);
app.use(responseMiddleware);
app.use(I18NEXT);

if (process.env.NODE_ENV !== "production") {
  console.log("📚 Swagger documentation is available at /api-docs");
  setupSwagger(app);
}

app.use("/api/health", healthRouter);
mainController(app).notFound();
mainController(app).errorResponse();

export default app;
