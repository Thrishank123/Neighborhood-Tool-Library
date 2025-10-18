// server/controllers/reservationController.js
import { pool } from "../config/db.js";

export const createReservation = async (req, res) => {
  try {
    const { tool_id, start_date, end_date } = req.body;
    const user_id = req.user.id;

    if (!tool_id || !start_date || !end_date) return res.status(400).json({ message: "Missing fields" });

    const start = new Date(start_date);
    const end = new Date(end_date);
    if (isNaN(start) || isNaN(end) || start >= end) return res.status(400).json({ message: "Invalid dates" });

    // Check overlapping reservations for same tool which are pending/active
    const overlapQuery = `
      SELECT 1 FROM reservations
      WHERE tool_id = $1
        AND status IN ('pending','active')
        AND NOT (end_date < $2 OR start_date > $3)
      LIMIT 1
    `;
    const overlap = await pool.query(overlapQuery, [tool_id, start_date, end_date]);
    if (overlap.rows.length) {
      return res.status(409).json({ message: "Tool already reserved for the selected dates" });
    }

    const insert = await pool.query(
      `INSERT INTO reservations (tool_id, user_id, start_date, end_date, status)
       VALUES ($1,$2,$3,$4,'pending') RETURNING id, tool_id, user_id, start_date, end_date, status`,
      [tool_id, user_id, start_date, end_date]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error("createReservation", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      `SELECT r.id, r.tool_id, t.name as tool_name, r.start_date, r.end_date, r.status
       FROM reservations r
       JOIN tools t ON r.tool_id = t.id
       WHERE r.user_id = $1
       ORDER BY r.start_date DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getUserReservations", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: update status (pending -> active -> closed)
export const updateReservationStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!["pending","active","closed"].includes(status)) return res.status(400).json({ message: "Invalid status" });

    const result = await pool.query(
      "UPDATE reservations SET status=$1 WHERE id=$2 RETURNING id, tool_id, user_id, start_date, end_date, status",
      [status, id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Reservation not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateReservationStatus", err);
    res.status(500).json({ message: "Server error" });
  }
};
