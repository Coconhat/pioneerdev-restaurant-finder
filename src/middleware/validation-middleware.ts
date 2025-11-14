import { RequestHandler } from "express";

export const validateMessage: RequestHandler = (req, res, next) => {
  const message = req.query.message;

  if (!message) {
    return res.status(400).json({
      status: 400,
      message: "Missing required parameter: message",
    });
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid message: must be a non-empty string",
    });
  }

  next();
};
