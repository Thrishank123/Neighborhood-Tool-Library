// server/controllers/toolController.js
import { pool } from "../config/db.js";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';

export const getAllTools = async (req, res) => {
  try {
    // Get tools with their current reservation status and admin_id
    const query = `
      SELECT
        t.id,
        t.name,
        t.description,
        t.category,
        t.image_url,
        t.admin_id,
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

export const createTool = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    // The image URL is now provided by Cloudinary via the middleware
    const imageUrl = req.file ? req.file.path : null;
    const adminId = req.user.id;

    const result = await pool.query(
      `INSERT INTO tools (name, description, category, image_url, admin_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, category, imageUrl, adminId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createTool error", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTool = async (req, res) => {
  try {
    const toolId = Number(req.params.id);
    const requestingAdminId = req.user.id;

    console.log(`deleteTool: Targeting tool ID ${toolId} by admin ID ${requestingAdminId}`);

    if (!toolId) return res.status(400).json({ message: "Invalid id" });

    // Fetc h both image_url and admin_id for the target tool
    const toolResult = await pool.query("SELECT image_url, admin_id FROM tools WHERE id=$1", [toolId]);
    if (!toolResult.rows.length) return res.status(404).json({ message: "Tool not found" });

    const toolOwnerId = toolResult.rows[0].admin_id;
    console.log(`deleteTool: Tool owner ID is ${toolOwnerId}`);

    // Compare the fetched toolOwnerId with the requestingAdminId
    console.log(`deleteTool: Comparing: Requesting Admin (${requestingAdminId}) vs Tool Owner (${toolOwnerId})`);

    if (toolOwnerId !== requestingAdminId) {
      console.log("deleteTool: PERMISSION DENIED - Admin does not own this tool");
      return res.status(403).json({ message: "You do not have permission to delete this tool." });
    }

    console.log("deleteTool: Ownership check passed. Proceeding with deletion.");

    const image = toolResult.rows[0].image_url;

    // Handle Cloudinary image deletion if it's a Cloudinary URL
    if (image && image.includes('cloudinary.com')) {
      console.log("deleteTool: Attempting to delete Cloudinary image");
      try {
        // Extract publicId from Cloudinary URL
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
        const urlParts = image.split('/');
        const publicIdWithFolder = urlParts.slice(-2).join('/').split('.')[0]; // e.g., "tool-library/xyz"
        await cloudinary.uploader.destroy(publicIdWithFolder);
        console.log("deleteTool: Cloudinary image deleted successfully");
      } catch (cloudinaryError) {
        console.error("deleteTool: Failed to delete Cloudinary image:", cloudinaryError);
        // Continue with tool deletion even if image deletion fails
      }
    } else if (image && image.startsWith("/uploads/")) {
      // Fallback for local uploads
      const filePath = path.join(process.cwd(), "uploads", path.basename(image));
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("deleteTool: Failed to delete local image file:", err);
        } else {
          console.log("deleteTool: Local image file deleted successfully");
        }
      });
    }

    console.log("deleteTool: Deleting tool from database");
    await pool.query("DELETE FROM tools WHERE id=$1", [toolId]);
    console.log("deleteTool: Tool deleted successfully from database");

    res.json({ message: "Tool deleted" });
  } catch (err) {
    console.error("deleteTool error during execution:", err);
    res.status(500).json({ message: "Server error" });
  }
};
