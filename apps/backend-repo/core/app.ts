import express from "express";
import cors from "cors";
import userRoutes from "../routes/userRoutes";
import authRoutes from "../routes/authRoutes";

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

export default app;
