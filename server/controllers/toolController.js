// server/controllers/toolController.js
import { pool } from "../config/db.js";
import path from "path";
import fs from "fs";

export const getAllTools = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, description, category, image_url FROM tools ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("getAllTools", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addTool = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    const result = await pool.query(
      "INSERT INTO tools (name, description, category, image_url) VALUES ($1,$2,$3,$4) RETURNING id, name, description, category, image_url",
      [name, description, category, image_url]
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
