import { db } from "../config/firebaseConfig";
import { User } from "../entities/user";

const USERS_COLLECTION = "USERS";

export const userCollection = {
  async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();

      if (!userDoc.exists) {
        return null;
      }

      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const updateData = {
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      await db.collection(USERS_COLLECTION).doc(userId).update(updateData);

      // Get the updated user
      const updatedUser = await this.getUser(userId);

      if (!updatedUser) {
        throw new Error("User not found after update");
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};
