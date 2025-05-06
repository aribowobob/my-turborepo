import express from "express";
import cors from "cors";
import userRoutes from "../routes/userRoutes";

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);

export default app;
