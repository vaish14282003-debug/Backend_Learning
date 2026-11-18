const { createUserWithPost } = require("../services/mongoTransaction.service");

async function createUserAndPost(req, res, next) {
  try {
    const result = await createUserWithPost(req.body.user, req.body.post);

    res.status(201).json({
      success: true,
      message: "User and post created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUserAndPost,
};
