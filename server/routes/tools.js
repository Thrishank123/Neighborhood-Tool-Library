// server/routes/tools.js
import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import { getAllTools, createTool, deleteTool } from "../controllers/toolController.js";
import { upload } from "../config/cloudinaryConfig.js";

const router = express.Router();

router.get("/", getAllTools);
router.post("/", authenticate, authorizeAdmin, upload.single("image"), createTool);
router.delete("/:id", authenticate, authorizeAdmin, deleteTool);

export default router;
