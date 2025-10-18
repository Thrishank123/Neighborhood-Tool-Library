// server/routes/reports.js
import express from "express";
import multer from "multer";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import { submitReport, getAllReports, resolveReport } from "../controllers/reportController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});
const upload = multer({ storage });

router.post("/", authenticate, upload.single("image"), submitReport);
router.get("/", authenticate, authorizeAdmin, getAllReports);
router.patch("/:id/resolve", authenticate, authorizeAdmin, resolveReport);

export default router;
