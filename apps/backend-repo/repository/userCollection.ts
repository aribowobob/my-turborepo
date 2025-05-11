import { db } from "../config/firebaseConfig";
import { User } from "../entities/user";
import { hash } from "bcrypt";

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

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const usersSnapshot = await db
        .collection(USERS_COLLECTION)
        .where("email", "==", email)
        .limit(1)
        .get();

      if (usersSnapshot.empty) {
        return null;
      }

      const userDoc = usersSnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  },

  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    try {
      // Check if email already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash the password
      const hashedPassword = await hash(userData.password || "", 10);

      // Prepare user data with timestamps
      const now = new Date().toISOString();
      const newUserData = {
        ...userData,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      };

      // Add user to collection
      const docRef = await db.collection(USERS_COLLECTION).add(newUserData);

      // Get the created user
      const userDoc = await docRef.get();

      // Return user data with ID
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
};
