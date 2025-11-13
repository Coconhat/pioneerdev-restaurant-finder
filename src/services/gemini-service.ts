import { GoogleGenAI } from "@google/genai";

export async function convertToFoursquareQuery(message: string) {
  // Initialize Google GenAI client
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  // Generate JSON content based on user message
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Your job is to convert the user's message into a valid JSON format for the Foursquare Places API,

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

  let text = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/json\n/g, "")
    .trim();

  return JSON.parse(text);
}
