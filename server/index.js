// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

import authRoutes from "./routes/auth.js";
import toolRoutes from "./routes/tools.js";
import reservationRoutes from "./routes/reservations.js";
import reportRoutes from "./routes/reports.js";
import reviewRoutes from "./routes/reviews.js";
import { pool } from "./config/db.js";

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:3000', // For local development
  'https://neighborhood-tool-library.vercel.app', // Your main production URL
  'https://neighborhood-tool-library-jgsnruq7h-thrishank123s-projects.vercel.app' // Specific preview URL
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};

app.use(cors(corsOptions)); // Use the cors middleware with your options
// --- End of CORS Configuration ---

app.use(express.json());

// ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reviews", reviewRoutes);

// Basic health check
app.get("/", (req, res) => res.send({ status: "ok", env: process.env.NODE_ENV || "dev" }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await pool.query("SELECT 1"); // verify DB connection
    console.log(`✅ Server running on port ${PORT} — DB connected`);
  } catch (err) {
    console.error("❌ DB connection failed on startup:", err);
  }
});
