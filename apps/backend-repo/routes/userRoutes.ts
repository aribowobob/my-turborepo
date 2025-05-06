import { Router } from "express";
import { fetchUserData, updateUserData } from "../controller/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/fetch-user-data", authMiddleware, fetchUserData);
router.post("/update-user-data", authMiddleware, updateUserData);

export default router;
