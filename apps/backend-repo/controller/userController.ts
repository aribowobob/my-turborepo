import { Request, Response } from "express";
import { db } from "../config/firebase";
import { User } from "../../../packages/shared/user";

const USERS_COLLECTION = "USERS";

export async function fetchUserData(req: Request, res: Response) {
  const uid = (req as any).user?.uid;

  try {
    const userDoc = await db.collection(USERS_COLLECTION).doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(userDoc.data());
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching user data", error: err });
  }
}

export async function updateUserData(req: Request, res: Response) {
  const uid = (req as any).user?.uid;
  const data: Partial<User> = req.body;

  try {
    await db.collection(USERS_COLLECTION).doc(uid).set(data, { merge: true });
    return res.status(200).json({ message: "User data updated successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating user data", error: err });
  }
}
