const crypto = require("crypto");
const AppError = require("../utils/AppError");
const {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} = require("../repositories/mongoRefreshToken.repository");
//const AppError = require("../utils/AppError");

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

async function createNewRefreshToken(userId) {
  const token = crypto.randomBytes(64).toString("hex");

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  );

  const refreshToken = await createRefreshToken({
    token,
    userId,
    expiresAt,
  });

  return refreshToken;
}

async function validateRefreshToken(token) {
  const refreshToken = await findRefreshToken(token);

  if (!refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (refreshToken.expiresAt < new Date()) {
    await deleteRefreshToken(token);
    throw new AppError("Refresh token expired", 401);
  }

  return refreshToken;
}

async function revokeRefreshToken(token) {
  await deleteRefreshToken(token);
}

module.exports = {
  createNewRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
};
