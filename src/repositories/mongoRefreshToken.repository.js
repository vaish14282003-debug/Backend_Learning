const RefreshToken = require("../models/refreshToken.model");

// Save refresh token
async function createRefreshToken(data) {
  return await RefreshToken.create(data);
}

// Find refresh token
async function findRefreshToken(token) {
  return await RefreshToken.findOne({ token });
}

// Delete refresh token
async function deleteRefreshToken(token) {
  return await RefreshToken.deleteOne({ token });
}

module.exports = {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
