const Post = require("../models/post.model");

// Create a post
async function createPost(data) {
  return await Post.create(data);
}

// Get posts with user details
async function getPostsWithUsers() {
  return await Post.find().populate("userId");
}
async function getPostById(id) {
  return await Post.findById(id);
}
async function getPostsWithPagination(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  return await Post.aggregate([
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],

        totalCount: [{ $count: "total" }],
      },
    },
  ]);
}
async function getUserPostDashboard(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

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
      $group: {
        _id: "$user._id",
        userName: { $first: "$user.name" },
        email: { $first: "$user.email" },
        totalPosts: { $sum: 1 },
        posts: {
          $push: {
            title: "$title",
            content: "$content",
            createdAt: "$createdAt",
          },
        },
      },
    },

    {
      $project: {
        _id: 1,
        userName: 1,
        email: 1,
        totalPosts: 1,
        posts: 1,
      },
    },

    {
      $facet: {
        data: [
          { $sort: { totalPosts: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
        totalUsers: [{ $count: "count" }],
      },
    },
  ]);
}
module.exports = {
  createPost,
  getPostsWithUsers,
  getPostById,
  getPostsWithPagination,
  getUserPostDashboard,
};
