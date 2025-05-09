import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../config/firebaseConfig";

const USERS_COLLECTION = "USERS";

/*
NOTE: This is a test user creation function.
HOW:
1. Create a new POST request
2. Set the URL to: http://localhost:3001/api/seed/create-test-user
3. No request body is needed since all values are hardcoded in the endpoint
4. Send the request 
*/

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export const seedController = {
  async createTestUser(req: Request, res: Response) {
    try {
      // Check if test user already exists
      const userRef = db.collection(USERS_COLLECTION).doc("test-user-id");
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        return res.status(200).json({
          message: "Test user already exists",
          userId: "test-user-id",
        });
      }

      // Create timestamp for both createdAt and updatedAt
      const now = new Date().toISOString();

      // Hash the password
      const hashedPassword = await hashPassword("qwerty123!");

      // Create the test user with specified fields
      const userData = {
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      };

      // Save to Firestore
      await userRef.set(userData);

      return res.status(201).json({
        message: "Test user created successfully",
        userId: "test-user-id",
      });
    } catch (error) {
      console.error("Error creating test user:", error);
      return res.status(500).json({
        message: "Failed to create test user",
        error,
      });
    }
  },
};
