// server/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: "Missing fields" });
    if (!["member", "admin"].includes(role)) return res.status(400).json({ message: "Invalid role" });

    const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rows.length) return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role",
      [name, email, hash, role]
    );

    const user = result.rows[0];
    res.status(201).json({ user });
  } catch (err) {
    console.error("register error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

    const result = await pool.query("SELECT id, name, email, password_hash, role FROM users WHERE email=$1", [email]);
    if (!result.rows.length) return res.status(400).json({ message: "Invalid email or password" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "12h" });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // The authenticate middleware already verifies the token and sets req.user
    const user = await pool.query("SELECT id, name, email, role FROM users WHERE id=$1", [req.user.id]);
    if (!user.rows.length) return res.status(404).json({ message: "User not found" });
    res.json({ user: user.rows[0] });
  } catch (err) {
    console.error("verifyToken error", err);
    res.status(500).json({ message: "Server error" });
  }
};
