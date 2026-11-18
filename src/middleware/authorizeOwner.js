const Post = require("../models/post.model");

async function authorizeOwner(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Admin can access any post
    if (req.user.role === "admin") {
      req.post = post;
      return next();
    }

    // Normal user can access only their own post
    if (post.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden: you do not own this resource",
      });
    }

    req.post = post;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authorizeOwner;
