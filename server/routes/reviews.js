// server/routes/reviews.js
import express from "express";
import { authenticate } from "../middleware/auth.js";
import { addReview, getReviewsForTool } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", authenticate, addReview);
router.get("/:tool_id", getReviewsForTool);

export default router;
