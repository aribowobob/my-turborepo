import jwt from "jsonwebtoken";
import { User } from "../entities/user";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret-key";
const TOKEN_EXPIRY = "24h";

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}
