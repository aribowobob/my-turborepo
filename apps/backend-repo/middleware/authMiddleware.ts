import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/authUtils";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split("Bearer ")[1];

  // Bypass authentication for testing with TEST_TOKEN
  if (process.env.NODE_ENV === "development" && token === "TEST_TOKEN") {
    // Simulate a decoded token for testing purposes
    (req as any).user = {
      id: "test-user-id",
      email: "test@example.com",
      name: "Test User",
    };
    return next();
  }

  try {
    const decodedToken = verifyToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error });
  }
}
