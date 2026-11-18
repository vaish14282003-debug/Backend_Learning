const express = require("express");
const { getFileUrl, deleteFile } = require("../services/s3.service");
const uploadS3 = require("../middleware/s3Upload.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/mongo/uploads/image:
 *   post:
 *     summary: Upload a single image to S3
 *     tags:
 *       - S3 Uploads
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: JPEG, PNG or WebP image. Maximum size 5 MB.
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully to S3
 *                 file:
 *                   type: object
 *                   properties:
 *                     originalName:
 *                       type: string
 *                       example: gym.jpg
 *                     mimetype:
 *                       type: string
 *                       example: image/jpeg
 *                     size:
 *                       type: integer
 *                       example: 245678
 *                     key:
 *                       type: string
 *                       example: uploads/1791290752706-gym.jpg
 *                     location:
 *                       type: string
 *                       example: https://s3.amazonaws.com/example-bucket/uploads/gym.jpg
 *       400:
 *         description: Invalid file type or file size
 */
router.post("/image", uploadS3.single("image"), (req, res) => {
  res.status(201).json({
    success: true,
    message: "Image uploaded successfully to S3",
    file: {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      key: req.file.key,
      location: req.file.location,
    },
  });
});

/**
 * @swagger
 * /api/mongo/uploads/images:
 *   post:
 *     summary: Upload multiple images to S3
 *     tags:
 *       - S3 Uploads
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Up to 5 JPEG, PNG or WebP images. Maximum 5 MB per file.
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 *       400:
 *         description: Invalid file type or file size
 */
router.post("/images", uploadS3.array("images", 5), (req, res) => {
  res.status(201).json({
    success: true,
    message: "Images uploaded successfully to S3",
    files: req.files.map((file) => ({
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      key: file.key,
      location: file.location,
    })),
  });
});

/**
 * @swagger
 * /api/mongo/uploads/file:
 *   get:
 *     summary: Generate a signed URL for an S3 file
 *     description: Generates a temporary signed URL for accessing a private S3 object. The URL expires after 300 seconds.
 *     tags:
 *       - S3 Uploads
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         description: S3 object key
 *         schema:
 *           type: string
 *           example: uploads/1791290752706-gym.jpg
 *     responses:
 *       200:
 *         description: Signed URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 url:
 *                   type: string
 *                   example: https://example.com/signed-url
 *                 expiresIn:
 *                   type: integer
 *                   example: 300
 *       400:
 *         description: S3 file key is required
 */
router.get("/file", async (req, res, next) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "S3 file key is required",
      });
    }

    const url = await getFileUrl(key);

    res.json({
      success: true,
      url,
      expiresIn: 300,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/mongo/uploads/file:
 *   delete:
 *     summary: Delete an S3 file
 *     tags:
 *       - S3 Uploads
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         description: S3 object key to delete
 *         schema:
 *           type: string
 *           example: uploads/1791290752706-gym.jpg
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: File deleted successfully from S3
 *                 key:
 *                   type: string
 *                   example: uploads/1791290752706-gym.jpg
 *       400:
 *         description: S3 file key is required
 */
router.delete("/file", async (req, res, next) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "S3 file key is required",
      });
    }

    await deleteFile(key);

    res.json({
      success: true,
      message: "File deleted successfully from S3",
      key,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
