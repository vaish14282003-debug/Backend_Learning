const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

// POST /users
router.post("/", userController.createUser);

// GET /users
//router.get("/", userController.getAllUsers);
// GET /users?page=1&limit=5
router.get("/", userController.getUsersPaginated);

router.get("/stats", userController.getUserStats);

router.get("/paginated", userController.getUsersPaginated);


// GET /users?page=1&limit=5
// GET /users?page=1&limit=5

router.post("/with-post", userController.createUserWithPost);

// GET /users/:id
router.get("/:id", userController.getUserById);

// PUT /users/:id
router.put("/:id", userController.updateUser);

// DELETE /users/:id
router.delete("/:id", userController.deleteUser);

// GET /users/:id/posts
router.get("/:id/posts", userController.getUserWithPosts);



module.exports = router;
