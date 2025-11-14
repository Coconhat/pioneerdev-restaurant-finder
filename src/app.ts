import dotenv from "dotenv";
dotenv.config();

import express from "express";
import executeRoute from "./routes/execute";
import { validateCode } from "./middleware/auth-middleware";
import { validateMessage } from "./middleware/validation-middleware";

const app = express();

app.use(express.json());

app.use("/api/execute", validateCode, validateMessage, executeRoute);

export default app;
