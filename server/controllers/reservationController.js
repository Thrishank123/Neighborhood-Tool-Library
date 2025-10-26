import { pool } from "../config/db.js";

export const createReservation = async (req, res) => {
  try {
    const { tool_id, start_date, end_date } = req.body;
    const user_id = req.user.id;

    if (!tool_id || !start_date || !end_date) return res.status(400).json({ message: "Missing fields" });

    const start = new Date(start_date);
    const end = new Date(end_date);
    if (isNaN(start) || isNaN(end) || start >= end) return res.status(400).json({ message: "Invalid dates" });

    // Check if the user is an admin trying to reserve their own tool
    const toolQuery = `SELECT admin_id FROM tools WHERE id = $1`;
    const toolResult = await pool.query(toolQuery, [tool_id]);
    if (!toolResult.rows.length) {
      return res.status(404).json({ message: "Tool not found" });
    }
    const toolAdminId = toolResult.rows[0].admin_id;
    console.log(`Checking self-reservation: User ID=${user_id}, Tool Admin ID=${toolAdminId}`);
    if (toolAdminId === user_id) {
      console.log("Self-reservation detected. Blocking.");
      return res.status(403).json({ message: "Admins cannot reserve their own tools" });
    }
    console.log("Self-reservation check passed.");

    // Removed single-reservation limit - users can now reserve multiple tools

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
       VALUES ($1,$2,$3,$4,'pending') RETURNING *`,
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
  const { status } = req.body;
  // Use a transaction only when approving, as other statuses are simple updates
  if (status === 'approved') {
    const client = await pool.connect();
    try {
      const id = Number(req.params.id);
      const admin_id = req.user.id;

      await client.query('BEGIN');

      const reservationResult = await client.query(
        "SELECT tool_id, start_date, end_date FROM reservations WHERE id = $1",
        [id]
      );
      if (!reservationResult.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: "Reservation not found" });
      }

      const { tool_id, start_date, end_date } = reservationResult.rows[0];

      // Check if the admin owns the tool
      const toolResult = await client.query("SELECT admin_id FROM tools WHERE id = $1", [tool_id]);
      if (!toolResult.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: "Tool not found" });
      }
      if (toolResult.rows[0].admin_id !== admin_id) {
        await client.query('ROLLBACK');
        return res.status(403).json({ message: "You do not have permission to manage reservations for this tool." });
      }

      // Reject overlapping pending reservations
      await client.query(
        `UPDATE reservations SET status = 'rejected'
         WHERE tool_id = $1 AND status = 'pending' AND id != $2
           AND NOT (end_date < $3 OR start_date > $4)`,
        [tool_id, id, start_date, end_date]
      );

      // Approve the target reservation
      const result = await client.query(
        "UPDATE reservations SET status=$1, approved_at=CURRENT_TIMESTAMP, approved_by=$2 WHERE id=$3 RETURNING *",
        [status, admin_id, id]
      );

      await client.query('COMMIT');
      return res.json(result.rows[0]);

    } catch (err) {
      await client.query('ROLLBACK');
      console.error("updateReservationStatus (approve)", err);
      return res.status(500).json({ message: "Server error" });
    } finally {
      client.release();
    }
  }

  // For other simple status updates, no transaction is needed
  try {
    const id = Number(req.params.id);
    const admin_id = req.user.id;

    // Fetch the tool_id for the reservation to check ownership
    const reservationCheck = await pool.query("SELECT tool_id FROM reservations WHERE id = $1", [id]);
    if (!reservationCheck.rows.length) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const tool_id = reservationCheck.rows[0].tool_id;

    // Check if the admin owns the tool
    const toolResult = await pool.query("SELECT admin_id FROM tools WHERE id = $1", [tool_id]);
    if (!toolResult.rows.length) {
      return res.status(404).json({ message: "Tool not found" });
    }
    if (toolResult.rows[0].admin_id !== admin_id) {
      return res.status(403).json({ message: "You do not have permission to manage reservations for this tool." });
    }

    const result = await pool.query(
      "UPDATE reservations SET status=$1 WHERE id=$2 RETURNING *",
      [status, id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Reservation not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateReservationStatus (other)", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Admin: get all pending reservation requests
export const getPendingReservations = async (req, res) => {
  try {
    const admin_id = req.user.id;
    console.log(`Fetching pending reservations for Admin ID: ${admin_id}`);

    const result = await pool.query(
      `SELECT r.id, r.tool_id, t.name as tool_name, u.name as user_name, u.email as user_email,
              r.start_date, r.end_date, r.status
       FROM reservations r
       JOIN tools t ON r.tool_id = t.id
       JOIN users u ON r.user_id = u.id
       WHERE r.status = 'pending' AND t.admin_id = $1
       ORDER BY r.id ASC`,
      [admin_id]
    );
    console.log(`Query returned ${result.rows.length} pending reservations.`);
    res.json(result.rows);
  } catch (err) {
    console.error("getPendingReservations error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: get all reservations (for admin panel)
export const getAllReservations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.tool_id, t.name as tool_name, u.name as user_name, u.email as user_email,
              r.start_date, r.end_date, r.status, r.created_at
       FROM reservations r
       JOIN tools t ON r.tool_id = t.id
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getAllReservations", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: get reservations for tools created by the logged-in admin
export const getAdminReservations = async (req, res) => {
  try {
    const admin_id = req.user.id;
    const result = await pool.query(
      `SELECT r.id, r.tool_id, t.name as tool_name, u.name as user_name, u.email as user_email,
              r.start_date, r.end_date, r.status, r.created_at
       FROM reservations r
       JOIN tools t ON r.tool_id = t.id
       JOIN users u ON r.user_id = u.id
       WHERE t.admin_id = $1
       ORDER BY r.created_at DESC`,
      [admin_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("getAdminReservations", err);
    res.status(500).json({ message: "Server error" });
  }
};

// User: return a tool (close active reservation)
// User: return or cancel a reservation
export const returnReservation = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const id = Number(req.params.id);
    const user_id = req.user.id;

    // Check if the reservation exists and belongs to the user
    const reservation = await client.query(
      "SELECT status FROM reservations WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );
    if (!reservation.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Reservation not found" });
    }

    // UPDATED LOGIC: Allow action on 'approved' or 'active' reservations
    const currentStatus = reservation.rows[0].status;
    if (!['approved', 'active'].includes(currentStatus)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: "Only approved or active reservations can be actioned" });
    }

    // Update reservation status to 'closed'
    const result = await client.query(
      "UPDATE reservations SET status='closed' WHERE id=$1 RETURNING *",
      [id]
    );

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("returnReservation", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};