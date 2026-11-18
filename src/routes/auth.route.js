const express = require("express");
const router = express.Router();

// //const authenticateToken = require("../middleware/auth.middleware");
// const authController = require("../controllers/auth.controller");
// //const authorizeRole = require("../middleware/authorizeRole");
// const {
//   authorizeRole,
//   authenticateToken,
// } = require("../middleware/authorizeRole");

const authController = require("../controllers/auth.controller");

const authenticateToken = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/authorizeRole");

const loginLimiter = require("../middleware/loginRateLimit.middleware");
//const loginLimiter = require("../middleware/loginRateLimit.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);
router.get("/me", authenticateToken, authController.getMe);
router.get(
  "/admin",
  authenticateToken,
  authorizeRole("admin"),
  authController.adminDashboard,
);
router.get(
  "/user",
  authenticateToken,
  authorizeRole("user"),
  authController.userDashboard,
);

module.exports = router;
