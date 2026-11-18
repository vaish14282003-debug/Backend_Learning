const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/mongoAuth.controller");
//const validate = require("../middleware/validate.middleware");
const joiValidate = require("../middleware/joiValidate.middleware");
// const {
//   registerSchema,
//   loginSchema,
// } = require("../validators/mongoAuth.validator");
const router = express.Router();
const apiRateLimiter = require("../middleware/rateLimit.middleware");
const {
  registerJoiSchema,
  loginJoiSchema,
} = require("../validators/mongoAuth.joi.validator");

// router.post("/register", register);
// router.post("/login", login);
router.use(apiRateLimiter);
/**
 * @swagger
 * /api/mongo/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Vaishnavi
 *               email:
 *                 type: string
 *                 format: email
 *                 example: vaishnavi@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 
 *     responses:
  *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Validation failed
 *       409:
 *         description: User already exists
 */

router.post("/register", joiValidate(registerJoiSchema), register);

/**
 * @swagger
 * /api/mongo/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: vaishnavi@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", joiValidate(loginJoiSchema), login);

/**
 * @swagger
 * /api/mongo/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       401:
 *         description: Refresh token is missing or invalid
 */


router.post("/refresh", refresh);
/**
 * @swagger
 * /api/mongo/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.post("/logout", logout);

//router.use(apiRateLimiter);

module.exports = router;
