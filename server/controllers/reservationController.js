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

    // Check if user already has an active reservation for any tool during the same period
    const userOverlapQuery = `
      SELECT 1 FROM reservations
      WHERE user_id = $1
        AND status IN ('approved','active')
        AND NOT (end_date < $2 OR start_date > $3)
      LIMIT 1
    `;
    const userOverlap = await pool.query(userOverlapQuery, [user_id, start_date, end_date]);
    if (userOverlap.rows.length) {
      return res.status(409).json({ message: "You can only have one active reservation at a time" });
    }

    // Check if there's already an approved/active reservation for this tool during the same period
    const toolOverlapQuery = `
      SELECT 1 FROM reservations
      WHERE tool_id = $1
        AND status IN ('approved','active')
        AND NOT (end_date < $2 OR start_date > $3)
      LIMIT 1
    `;
    const toolOverlap = await pool.query(toolOverlapQuery, [tool_id, start_date, end_date]);
    if (toolOverlap.rows.length) {
      return res.status(409).json({ message: "Tool already reserved for the selected dates" });
    }

    const insert = await pool.query(
      `INSERT INTO reservations (tool_id, user_id, start_date, end_date, status)
       VALUES ($1,$2,$3,$4,'pending') RETURNING id, tool_id, user_id, start_date, end_date, status, created_at`,
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

// Admin: approve/reject reservation requests
export const updateReservationStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const admin_id = req.user.id;

    if (!["approved","rejected","active","closed"].includes(status)) return res.status(400).json({ message: "Invalid status" });

    // If approving a reservation, reject all other pending reservations for the same tool and dates
    if (status === 'approved') {
      // Get the reservation details first
      const reservation = await pool.query(
        "SELECT tool_id, start_date, end_date FROM reservations WHERE id = $1",
        [id]
      );
      if (!reservation.rows.length) return res.status(404).json({ message: "Reservation not found" });

      const { tool_id, start_date, end_date } = reservation.rows[0];

      // Reject all other pending reservations for this tool during the same period
      await pool.query(
        `UPDATE reservations
         SET status = 'rejected'
         WHERE tool_id = $1
           AND status = 'pending'
           AND id != $2
           AND NOT (end_date < $3 OR start_date > $4)`,
        [tool_id, id, start_date, end_date]
      );

      // Update the approved reservation
      const result = await pool.query(
        "UPDATE reservations SET status=$1, approved_at=CURRENT_TIMESTAMP, approved_by=$2 WHERE id=$3 RETURNING id, tool_id, user_id, start_date, end_date, status, approved_at",
        [status, admin_id, id]
      );
      return res.json(result.rows[0]);
    }

    // For other status updates
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

// Admin: get all pending reservation requests
export const getPendingReservations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.tool_id, t.name as tool_name, u.name as user_name, u.email as user_email,
              r.start_date, r.end_date, r.status
       FROM reservations r
       JOIN tools t ON r.tool_id = t.id
       JOIN users u ON r.user_id = u.id
       WHERE r.status = 'pending'
       ORDER BY r.id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getPendingReservations", err);
    res.status(500).json({ message: "Server error" });
  }
};
