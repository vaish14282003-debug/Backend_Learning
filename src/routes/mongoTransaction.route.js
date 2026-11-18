const express = require("express");
const {
  createUserAndPost,
} = require("../controllers/mongoTransaction.controller");

const router = express.Router();

/**
 * @swagger
 * /api/mongo/transaction/user-post:
 *   post:
 *     summary: Create a user and post in a transaction
 *     description: Creates a user and post together using a MongoDB transaction. If either operation fails, the transaction is rolled back.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - post
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - name
 *                   - email
 *                   - password
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Vaishnavi
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: vaishnavi@example.com
 *                   password:
 *                     type: string
 *                     format: password
 *                     example: password123
 *                   role:
 *                     type: string
 *                     enum:
 *                       - user
 *                       - admin
 *                     example: user
 *               post:
 *                 type: object
 *                 required:
 *                   - title
 *                   - content
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: My first post
 *                   content:
 *                     type: string
 *                     example: Learning MongoDB transactions
 *     responses:
 *       201:
 *         description: User and post created successfully
 *       400:
 *         description: Invalid request data
 *       409:
 *         description: User already exists
 *       500:
 *         description: Transaction failed
 */
router.post("/user-post", createUserAndPost);
router.post("/user-post", createUserAndPost);

module.exports = router;
