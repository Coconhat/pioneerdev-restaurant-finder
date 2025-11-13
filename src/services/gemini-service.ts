import { GoogleGenAI } from "@google/genai";

export async function convertToFoursquareQuery(message: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
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
    } catch (error: any) {
      console.error(`Attempt ${i + 1} failed:`, error.message);

      // If 503 error and not last retry, wait and continue
      if (error.status === 503 && i < retries - 1) {
        console.log(`Retrying in 2 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      // If last retry, throw
      if (i === retries - 1) {
        throw error;
      }
    }
  }

  throw new Error("Failed after all retries");
}
