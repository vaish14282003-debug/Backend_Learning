// const express = require("express");

// const authenticateToken = require("../middleware/auth.middleware");
// const authorizeRole = require("../middleware/authorizeRole");

// const router = express.Router();

// router.get(
//   "/dashboard",
//   authenticateToken,
//   authorizeRole("admin"),
//   (req, res) => {
//     res.status(200).json({
//       success: true,
//       message: "Welcome to admin dashboard",
//       user: req.user,
//     });
//   },
// );

// module.exports = router;
const express = require("express");

const authenticateToken = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

/**
 * @swagger
 * /api/mongo/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard
 *     description: Access the admin dashboard. Requires a valid JWT and admin role.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard accessed successfully
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
 *                   example: Welcome to admin dashboard
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Access token is missing or invalid
 *       403:
 *         description: User does not have admin privileges
 */
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to admin dashboard",
      user: req.user,
    });
  },
);

module.exports = router;