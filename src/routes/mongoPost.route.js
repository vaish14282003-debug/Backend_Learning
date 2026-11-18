const express = require("express");

const authenticateToken = require("../middleware/auth.middleware");
const authorizeOwner = require("../middleware/authorizeOwner");

const router = express.Router();

/**
 * @swagger
 * /api/mongo/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Get a post only if the authenticated user owns it.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB post ID
 *         schema:
 *           type: string
 *           example: 68c123456789abcdef123456
 *     responses:
 *       200:
 *         description: Post accessed successfully
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
 *                   example: Post accessed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       401:
 *         description: Access token is missing or invalid
 *       403:
 *         description: User is not the owner of the post
 *       404:
 *         description: Post not found
 *       400:
 *         description: Invalid post ID
 */
router.get("/:id", authenticateToken, authorizeOwner, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Post accessed successfully",
    data: req.post,
  });
});

module.exports = router;
