const mongoose = require("mongoose");
const User = require("../models/user.model");
const Post = require("../models/post.model");

async function createUserWithPost(userData, postData) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const [user] = await User.create(
      [
        {
          ...userData,
        },
      ],
      { session },
    );

    const [post] = await Post.create(
      [
        {
          ...postData,
          userId: user._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return {
      user,
      post,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

module.exports = {
  createUserWithPost,
};
