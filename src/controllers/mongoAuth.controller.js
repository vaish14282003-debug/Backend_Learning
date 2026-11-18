const { registerUser } = require("../services/mongoAuth.service");
const { loginUser } = require("../services/mongoAuth.service");
const { generateToken } = require("../utils/jwt");
const {
  createNewRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
} = require("../services/mongoRefreshToken.service");
async function register(req, res, next) {
  try {
    const { name, email, password} = req.body;

    const user = await registerUser({
      name,
      email,
      password,
    //  role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}
// async function login(req, res, next) {
//   try {
//     const { email, password } = req.body;

//     const user = await loginUser({
//       email,
//       password,
//     });
// const token = generateToken(user);
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: token,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// }
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await loginUser({
      email,
      password,
    });

    // Short-lived access token
    const accessToken = generateToken(user);

    // Long-lived refresh token
    const refreshToken = await createNewRefreshToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken: refreshToken.token,
      },
    });
  } catch (error) {
    next(error);
  }
}
async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    await revokeRefreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
}
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const storedToken = await validateRefreshToken(refreshToken);

    const User = require("../models/user.model");

    const user = await User.findById(storedToken.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    const accessToken = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
};
