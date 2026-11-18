const User = require("../models/user.model");
const AppError = require("../utils/AppError");
async function registerUser({ name, email, password, role }) {
  const existingUser = await User.findOne({ email });

  // if (existingUser) {
  //   throw new Error("User already exists");
  // }
  if (existingUser) {
    throw new AppError("User already exists", 409);
  }
  

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  return user;
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");

  // if (!user) {
  //   throw new Error("Invalid email or password");
  // }
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(password);

  // if (!isPasswordValid) {
  //   throw new Error("Invalid email or password");
  // }
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return user;
}
module.exports = {
  registerUser,
  loginUser,
};
