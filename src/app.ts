import dotenv from "dotenv";
dotenv.config();

import express from "express";
import executeRoute from "./routes/execute";

const app = express();

app.use(express.json());

app.use("/api/execute", executeRoute);

export default app;
