import cors, { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.ALLOWED_ORIGINS?.split(",") || []
      : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "accept-language"],
  credentials: true,
};

const CORS = cors(corsOptions);
export { CORS };
