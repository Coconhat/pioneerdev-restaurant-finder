import { GoogleGenAI } from "@google/genai";
import Router from "express";
import { convertToFoursquareQuery } from "../services/gemini-service";

const router = Router();

router.get("/", async (req, res) => {
  console.log("query:", req.query);

  const { message, code } = req.query;

  // Auth check
  if (code !== process.env.AUTH_CODE) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const data = await convertToFoursquareQuery(message as string);

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
