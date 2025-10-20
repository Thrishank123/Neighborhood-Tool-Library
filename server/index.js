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

// --- SIMPLIFIED CORS CONFIGURATION ---
const corsOptions = {
  origin: (origin, callback) => {
    // This dynamic check allows localhost, and any Vercel or Render domains.
    const isAllowed = !origin || 
                      origin.startsWith('http://localhost') || 
                      origin.endsWith('.vercel.app') || 
                      origin.endsWith('.onrender.com');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
// --- END OF CORS CONFIGURATION ---

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


