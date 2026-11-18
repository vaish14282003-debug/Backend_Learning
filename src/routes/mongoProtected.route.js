const express = require("express");
const  authenticateToken  = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/mongo/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user profile
 *       401:
 *         description: Authentication token is missing or invalid
 */
router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You accessed a protected route",
    user: req.user,
  });
});

// router.get("/profile", authenticateToken, (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "You accessed a protected route",
//     user: req.user,
//   });
// });

module.exports = router;
