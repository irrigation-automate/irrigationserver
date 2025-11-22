import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { enirementVariables } from "../configs/envirementVariables";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "My Express API",
      version: "1.0.0",
      description: "API documentation for my Express app",
      contact: {
        name: "Raed Rdhaounia",
        email: "raedrdhaounia@gmail.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${enirementVariables.serverConfig.PORT}`,
        description: "Local server",
      },
      {
        url: `${enirementVariables.serverConfig.DevelopmentServer}`,
        description: "development server",
      },
    ],
    // Require JWT bearer auth by default for all operations
    security: [
      {
        BearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Provide a valid JWT access token",
        },
      },
      // Global reusable parameters
      parameters: {
        LanguageHeader: {
          name: "Accept-Language",
          in: "header",
          description: "Preferred response language",
          required: true,
          schema: {
            type: "string",
            enum: ["en", "fr", "ar"],
            default: "en",
          },
        },
      },
    },
  },
  apis: [
    path.resolve(__dirname, "../Models/**/*.model.ts"),
    path.resolve(__dirname, "../Models/**/*.model.js"),
    path.resolve(__dirname, "../interface/**/*.ts"),
    path.resolve(__dirname, "../interface/**/*.js"),
    path.resolve(__dirname, "../Routes/**/*.ts"),
    path.resolve(__dirname, "../Routes/**/*.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("✅ Swagger UI available at /api-docs");
};
