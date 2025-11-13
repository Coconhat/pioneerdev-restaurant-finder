import { GoogleGenAI } from "@google/genai";
import Router from "express";

const router = Router();

router.get("/", async (req, res) => {
  console.log("query:", req.query);

  const { message, code } = req.query;

  // Auth check
  if (code !== process.env.AUTH_CODE) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Initialize Google GenAI client
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  // Generate JSON content based on user message
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Your job is to convert the user's message into a json format for the Foursquare Places API,

      it should be like this: 
      {
            "action": "restaurant_search",
            "parameters": {
            "query": "sushi",
            "near": "downtown Los Angeles",
            "price": "1",
            "open_now": true
  }
      
      user message: ${message}`,
    });
    res.json({
      success: true,
      aiResponse: response.text,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
