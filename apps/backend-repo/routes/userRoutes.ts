import express from "express";
import { api } from "../controller/api";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// User endpoints
router.get("/user", api.fetchUserData);
router.put("/update-user-data", api.updateUserData);

export default router;
