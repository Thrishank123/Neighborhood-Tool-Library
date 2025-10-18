// server/routes/tools.js
import express from "express";
import multer from "multer";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import { getAllTools, addTool, deleteTool } from "../controllers/toolController.js";

const router = express.Router();

// multer setup to uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});
const upload = multer({ storage });

router.get("/", getAllTools);
router.post("/", authenticate, authorizeAdmin, upload.single("image"), addTool);
router.delete("/:id", authenticate, authorizeAdmin, deleteTool);

export default router;
