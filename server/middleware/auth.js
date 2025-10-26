// server/middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req, res, next) => {
  const header = req.header("Authorization");
  console.log("Authenticate middleware - Authorization header:", header);
  if (!header) return res.status(401).json({ message: "Authorization header missing" });
  const token = header.replace("Bearer ", "").trim();
  console.log("Authenticate middleware - Token extracted:", token ? "Present" : "Missing");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Authenticate middleware - Decoded token:", decoded);
    req.user = decoded; // { id, role, email }
    console.log("Authenticate middleware - req.user set:", req.user);
    next();
  } catch (err) {
    console.log("Authenticate middleware - Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeAdmin = (req, res, next) => {
  console.log("AuthorizeAdmin middleware - req.user:", req.user);
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  console.log("AuthorizeAdmin middleware - User role:", req.user.role);
  if (req.user.role !== "admin") {
    console.log("AuthorizeAdmin middleware - Access denied: role is not admin");
    return res.status(403).json({ message: "Admin access required" });
  }
  console.log("AuthorizeAdmin middleware - Access granted for admin");
  next();
};
