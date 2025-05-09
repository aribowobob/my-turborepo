import { Request, Response } from "express";
import { compare } from "bcrypt";
import { userCollection } from "../repository/userCollection";
import { generateToken } from "../utils/authUtils";

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      // Find user by email
      const user = await userCollection.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Verify password
      const isPasswordValid = await compare(password, user.password || "");

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Generate token
      const token = generateToken(user);

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error,
      });
    }
  },
};
