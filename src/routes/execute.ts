import Router from "express";

const router = Router();

router.get("/", (req, res) => {
  console.log("query:", req.query);

  const { message, code } = req.query;

  if (code !== process.env.AUTH_CODE) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({
    success: true,
    message: `Received: ${message}`,
  });
});

export default router;
