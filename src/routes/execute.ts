import Router from "express";
import { convertToFoursquareQuery } from "../services/gemini-service";
import { searchPlaces } from "../services/foursquare-service";

const router = Router();

router.get("/", async (req, res) => {
  console.log("query:", req.query);

  const { message } = req.query;

  try {
    // Convert message to Foursquare query parameters using Gemini AI
    const data = await convertToFoursquareQuery(message as string);
    console.log(`data parametersss:`, data.parameters);

    // Search places on Foursquare API using the generated parameters
    const places = await searchPlaces(data.parameters);

    res.json({
      success: true,
      data: places, // return the json results from Foursquare API
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
