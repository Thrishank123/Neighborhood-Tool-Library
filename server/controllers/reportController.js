// server/controllers/reportController.js
import { pool } from "../config/db.js";

export const submitReport = async (req, res) => {
  try {
    const { tool_id, description } = req.body;
    const user_id = req.user.id;
    if (!tool_id || !description) return res.status(400).json({ message: "Missing fields" });

    let image_url = null;
    if (req.file) image_url = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO damage_reports (tool_id, user_id, description, image_url, resolved)
       VALUES ($1,$2,$3,$4,FALSE) RETURNING id, tool_id, user_id, description, image_url, resolved`,
      [tool_id, user_id, description, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("submitReport", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT dr.id, dr.tool_id, t.name as tool_name, dr.user_id, u.name as reporter, dr.description, dr.image_url, dr.resolved, dr.created_at
       FROM damage_reports dr
       JOIN tools t ON dr.tool_id = t.id
       JOIN users u ON dr.user_id = u.id
       ORDER BY dr.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getAllReports", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: get damage reports for tools created by the logged-in admin
export const getAdminReports = async (req, res) => {
  try {
    const admin_id = req.user.id;
    const result = await pool.query(
      `SELECT dr.id, dr.tool_id, t.name as tool_name, dr.user_id, u.name as reporter, dr.description, dr.image_url, dr.resolved, dr.created_at
       FROM damage_reports dr
       JOIN tools t ON dr.tool_id = t.id
       JOIN users u ON dr.user_id = u.id
       WHERE t.admin_id = $1
       ORDER BY dr.created_at DESC`,
      [admin_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getAdminReports", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await pool.query(
      "UPDATE damage_reports SET resolved = TRUE WHERE id=$1 RETURNING id, tool_id, user_id, description, image_url, resolved",
      [id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Report not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("resolveReport", err);
    res.status(500).json({ message: "Server error" });
  }
};
