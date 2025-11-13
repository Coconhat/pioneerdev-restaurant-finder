import { GoogleGenAI } from "@google/genai";

export async function convertToFoursquareQuery(message: string) {
  // Initialize Google GenAI client
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  // Generate JSON content based on user message
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a search query parser for the Foursquare Places API.

     Extract these fields from the user's message:
    - query: type of place (e.g., "sushi", "coffee shop", "pizza")
    - near: location (city, neighborhood, or address)
    - min_price/max_price: 1-4 (if mentioned: cheap=1, moderate=2, expensive=3-4)
    - open_now: true if user says "open now" or similar
    - sort: "RATING" if user wants "best" or "highest rated", "DISTANCE" if "nearby/closest", otherwise "RELEVANCE"
    - limit: number of results (default 10)

Return ONLY valid JSON, no markdown:
{
  "parameters": {
    "query": "...",
    "near": "...",
    "min_price": 1,
    "open_now": true,
    "sort": "RATING",
    "limit": 10
  }
}

User message: ${message}`,
  });

  let text = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/json\n/g, "")
    .trim();

  return JSON.parse(text);
}
