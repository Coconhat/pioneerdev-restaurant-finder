import dotenv from "dotenv";
dotenv.config();

import express from "express";
import executeRoute from "./routes/execute";
import { validateCode } from "./middleware/auth-middleware";
import { validateMessage } from "./middleware/validation-middleware";

const app = express();

app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  if (!process.env.GEMINI_API_KEY || !process.env.FOURSQUARE_API_KEY) {
    res.json({
      status: "error",
      message: "Missing required API keys in environment variables",
    });
    return;
  }
  res.json({
    status: "ok",
    message: "Server is running",
    instruction:
      "Use /api/execute endpoint with 'message' query parameter to search places. Add 'code' query parameter for authentication after the message",
    example:
      "/api/execute?message=coffee%20shops%20in%20New%20York&code=YOUR_AUTH_CODE",
  });
});

app.use("/api/execute", validateCode, validateMessage, executeRoute);

export default app;
