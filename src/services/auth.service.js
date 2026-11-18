const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

async function register(name, email, password) {
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return await userRepository.registerUser(name, email, passwordHash);
}

async function login(email, password) {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    },
  );
  const refreshToken = crypto.randomBytes(64).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await userRepository.saveRefreshToken(user.id, tokenHash, expiresAt);

  
  return {
    message: "Login successful",
    token,
    refreshToken,
  };
}
async function refreshAccessToken(refreshToken) {
  const crypto = require("crypto");

  // 1. Hash the refresh token
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // 2. Find the token in the database
  const storedToken = await userRepository.findRefreshToken(tokenHash);

  if (!storedToken) {
    throw new Error("Invalid or expired refresh token");
  }

  // 3. Generate a new access token
  const token = jwt.sign(
    {
      id: storedToken.user_id,
      email: storedToken.email,
      role: storedToken.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    },
  );

  // 4. Return the new access token
  return {
    message: "Access token refreshed successfully",
    token,
  };
}
async function logout(refreshToken) {
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const deleted = await userRepository.deleteRefreshToken(tokenHash);

  if (!deleted) {
    throw new Error("Invalid refresh token");
  }

  return {
    message: "Logout successful",
  };
}

module.exports = { register, login , refreshAccessToken, logout }; 
