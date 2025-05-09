import express from "express";
import { authController } from "../controller/authController";

const router = express.Router();

// Auth endpoints
router.post("/login", authController.login);

export default router;
