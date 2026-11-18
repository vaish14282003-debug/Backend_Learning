const User = require("../models/user.model");

// Get all users
async function getAllUsers() {
  return await User.find();
}

// Get one user by ID
async function getUserById(id) {
  return await User.findById(id);
}

// Get users with selected fields only
async function getUserBasicInfo() {
  return await User.find().select("name email role");
}

// Get users as plain JavaScript objects
async function getUsersLean() {
  return await User.find().lean();
}

// Create user
async function createUser(data) {
  return await User.create(data);
}

// Update user
async function updateUser(id, data) {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

// Delete user
async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}
async function testValidation() {
  return await User.create({
    name: "A",
    email: "invalid-email",
    role: "manager",
  });
}
async function getUsersPaginated(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments();

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
async function getUsersFiltered({
  page = 1,
  limit = 10,
  role,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
}) {
  const skip = (page - 1) * limit;

  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  // Only allow safe fields for sorting
  const allowedSortFields = ["name", "email", "createdAt"];

  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const sortDirection = sortOrder === "asc" ? 1 : -1;

//   const users = await User.find(filter)
//     .skip(skip)
//     .limit(limit)
//     .sort({
//       [sortField]: sortDirection,
//     });
const users = await User.find(filter)
  .select("-__v")
  .lean()
  .skip(skip)
  .limit(limit)
  .sort({
    [sortField]: sortDirection,
  });

  const total = await User.countDocuments(filter);

//   return {
//     users,
//     total,
//     page,
//     limit,
//     totalPages: Math.ceil(total / limit),
//   };
return {
  data: users,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
};
}
async function getUsersByRoleStats() {
  return await User.aggregate([
    {
      $group: {
        _id: "$role",
        totalUsers: { $sum: 1 },
      },
    },
    {
      $sort: {
        totalUsers: -1,
      },
    },
  ]);
}
async function getUserSummary() {
  return await User.aggregate([
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        role: 1,
        accountCreated: "$createdAt",
      },
    },
  ]);
}
async function getPostsWithUserDetails() {
  return await Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        "user.name": 1,
        "user.email": 1,
        "user.role": 1,
        createdAt: 1,
      },
    },
  ]);
}
module.exports = {
  getAllUsers,
  getUserById,
  getUserBasicInfo,
  getUsersLean,
  createUser,
  updateUser,
  deleteUser,
  testValidation,
  getUsersPaginated,
  getUsersFiltered,
  getUsersByRoleStats,
  getUserSummary,
  getPostsWithUserDetails,
};
