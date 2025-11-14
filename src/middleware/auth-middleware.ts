import { RequestHandler } from "express";

export const validateCode: RequestHandler = (req, res, next) => {
  const code = req.query.code;
  const accessCode = process.env.AUTH_CODE;

  if (!code) {
    return res
      .status(400)
      .json({ message: "A code query parameter must be provided" });
  }

  if (code !== accessCode) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
