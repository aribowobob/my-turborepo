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

  async register(req: Request, res: Response) {
    try {
      const { email, name, password } = req.body;

      // Validate input
      if (!email || !name || !password) {
        return res.status(400).json({
          message: "Email, name, and password are required",
        });
      }

      // Validate email format
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Please enter a valid email address",
        });
      }

      // Validate name length
      if (name.length < 6) {
        return res.status(400).json({
          message: "Name must be at least 6 characters long",
        });
      }

      // Validate password length
      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long",
        });
      }

      // Create the user
      const user = await userCollection.createUser({
        email,
        name,
        password,
      });

      // Generate token
      const token = generateToken(user);

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        message: "User registered successfully",
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);

      // Check if it's a duplicate email error
      if (
        error instanceof Error &&
        error.message === "User with this email already exists"
      ) {
        return res.status(409).json({
          message: "Email is already registered",
        });
      }

      return res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
};
