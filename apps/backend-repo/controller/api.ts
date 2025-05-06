import { Request, Response } from "express";
import { userCollection } from "../repository/userCollection";

export const api = {
  async fetchUserData(req: Request, res: Response) {
    try {
      const userId = (req as any).user.uid;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const userData = await userCollection.getUser(userId);

      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },

  async updateUserData(req: Request, res: Response) {
    try {
      const userId = (req as any).user.uid;
      const userData = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      if (!userData || Object.keys(userData).length === 0) {
        return res.status(400).json({ message: "No data provided for update" });
      }

      const updatedUser = await userCollection.updateUser(userId, userData);

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user data:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  },
};
