const authService = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const user = await authService.register(name, email, password);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
}
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await authService.login(email, password);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
function getMe(req, res) {
  res.status(200).json({
    message: "Authenticated user",
    user: req.user,
  });
}
function adminDashboard(req, res) {
  res.status(200).json({
    message: "Welcome to the Admin Dashboard",
    user: req.user,
  });
}
async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}
async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const result = await authService.logout(refreshToken);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
function userDashboard(req, res) {
  res.status(200).json({
    success: true,
    message: "Welcome to user dashboard",
    user: req.user,
  });
}

module.exports = { register, login, getMe, adminDashboard , refresh, logout, userDashboard};
