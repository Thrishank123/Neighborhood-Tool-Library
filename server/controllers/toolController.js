// server/controllers/toolController.js
import { pool } from "../config/db.js";
import path from "path";
import fs from "fs";

export const getAllTools = async (req, res) => {
  try {
    // Get tools with their current reservation status
    const query = `
      SELECT
        t.id,
        t.name,
        t.description,
        t.category,
        t.image_url,
        CASE
          WHEN r.tool_id IS NOT NULL THEN 'In Use'
          ELSE 'Available'
        END as status
      FROM tools t
      LEFT JOIN (
        SELECT DISTINCT tool_id
        FROM reservations
        WHERE status IN ('approved', 'active')
        AND start_date <= CURRENT_DATE
        AND end_date >= CURRENT_DATE
      ) r ON t.id = r.tool_id
      ORDER BY t.id DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("getAllTools", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addTool = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const admin_id = req.user.id;
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    const result = await pool.query(
      "INSERT INTO tools (name, description, category, image_url, admin_id) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, description, category, image_url",
      [name, description, category, image_url, admin_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("addTool", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTool = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    // If tool has an image, attempt to remove file
    const t = await pool.query("SELECT image_url FROM tools WHERE id=$1", [id]);
    if (!t.rows.length) return res.status(404).json({ message: "Tool not found" });

    const image = t.rows[0].image_url;
    if (image && image.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "uploads", path.basename(image));
      fs.unlink(filePath, (err) => { if (err) {/* no-op */} });
    }

    await pool.query("DELETE FROM tools WHERE id=$1", [id]);
    res.json({ message: "Tool deleted" });
  } catch (err) {
    console.error("deleteTool", err);
    res.status(500).json({ message: "Server error" });
  }
};
