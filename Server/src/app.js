import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import partneshipRoutes from "./routes/partnership.routes.js";
import db_connection from "../database/db_connection.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // adjust for frontend
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/partnership", partneshipRoutes);

// DB + Server
const startServer = async () => {
  try {
    await db_connection();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
