// server/controllers/reviewController.js
import { pool } from "../config/db.js";

export const addReview = async (req, res) => {
  try {
    const { tool_id, rating, comment } = req.body;
    const user_id = req.user.id;
    if (!tool_id || !rating) return res.status(400).json({ message: "Missing fields" });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be 1-5" });

    const result = await pool.query(
      `INSERT INTO reviews (tool_id, user_id, rating, comment) VALUES ($1,$2,$3,$4) RETURNING id, tool_id, user_id, rating, comment`,
      [tool_id, user_id, rating, comment || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("addReview", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReviewsForTool = async (req, res) => {
  try {
    const tool_id = Number(req.params.tool_id);
    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, u.id as user_id, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.tool_id = $1
       ORDER BY r.id DESC`,
      [tool_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getReviewsForTool", err);
    res.status(500).json({ message: "Server error" });
  }
};
