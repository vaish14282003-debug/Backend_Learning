const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const pool = require("../config/db");

const fs = require("fs");
const path = require("path");

// POST /uploads
router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    // Check whether a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    // Temporary user ID
    const userId = 1;

    // Save file metadata in PostgreSQL
    const result = await pool.query(
      `INSERT INTO uploads
       (user_id, original_name, stored_name, file_path, file_size)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userId,
        req.file.originalname,
        req.file.filename,
        req.file.path,
        req.file.size,
      ],
    );

    return res.status(201).json({
      success: true,
      message: "File uploaded and metadata saved",
      file: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

// GET /uploads - Get all uploaded file records
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM uploads ORDER BY created_at DESC"
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      files: result.rows,
    });
  } catch (err) {
    next(err);
  }
});
// GET /uploads/:id - Get one uploaded file
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID",
      });
    }

    const result = await pool.query(
      "SELECT * FROM uploads WHERE id = $1",
      [Number(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    return res.status(200).json({
      success: true,
      file: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /uploads/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID",
      });
    }

    const result = await pool.query(
      "SELECT * FROM uploads WHERE id = $1",
      [Number(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const file = result.rows[0];

    await pool.query("DELETE FROM uploads WHERE id = $1", [Number(id)]);

    const filePath = path.resolve(file.file_path);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
