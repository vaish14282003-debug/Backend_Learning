const userService = require("../services/user.service");

// async function createUser(req, res, next) {
//   try {
//     const user = await userService.createUser(req.body.name);

//     res.status(201).json({
//       message: "User created successfully",
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// }
async function createUser(req, res, next) {
  try {
    const { name } = req.body;

    // Check if name is missing or empty
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // Check minimum name length
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters long",
      });
    }

    const user = await userService.createUser(name.trim());

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.getUserById(Number(req.params.id));

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(
      Number(req.params.id),
      req.body.name,
    );

    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await userService.deleteUser(Number(req.params.id));

    res.status(200).json({
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
async function getUserWithPosts(req, res, next) {
  try {
    const user = await userService.getUserWithPosts(Number(req.params.id));

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
async function getUserStats(req, res, next) {
  try {
    const stats = await userService.getUserStats();

    res.status(200).json({
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}
// async function getUsersPaginated(req, res, next) {
//   try {
//     const page = Math.max(1, parseInt(req.query.page, 10) || 1);
//     const limit = Math.min(
//       100,
//       Math.max(1, parseInt(req.query.limit, 10) || 5),
//     );

//     const offset = (page - 1) * limit;

//     const users = await userService.getUsersPaginated(limit, offset);

//     res.status(200).json({
//       page,
//       limit,
//       data: users,
//     });
//   } catch (error) {
//     next(error);
//   }
// }
async function getUsersPaginated(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 5),
    );

    const { role, search } = req.query;

    const sortBy = req.query.sortBy || "id";
    const order =
      (req.query.order || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC";

    const offset = (page - 1) * limit;

    const users = await userService.getUsersPaginated(
      limit,
      offset,
      role,
      search,
      sortBy,
      order,
    );

    res.status(200).json({
      success: true,
      page,
      limit,
      filters: { role, search },
      sort: { sortBy, order },
      data: users,
    });
  } catch (error) {
    next(error);
  }
}
async function createUserWithPost(req, res, next) {
  try {
    const { name, title, content } = req.body;

    const result = await userService.createUserWithPost(name, title, content);

    res.status(201).json({
      message: "User and post created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserWithPosts,
  getUserStats,
  getUsersPaginated,
  createUserWithPost,

};



