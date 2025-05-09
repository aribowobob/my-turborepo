import express from "express";
import { seedController } from "../controller/seedController";

const router = express.Router();

// Create test user endpoint (no auth required)
router.post("/create-test-user", seedController.createTestUser);

export default router;
