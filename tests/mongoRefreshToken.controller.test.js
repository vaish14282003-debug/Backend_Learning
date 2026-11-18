const request = require("supertest");
const express = require("express");
//const AppError = require("../utils/AppError");

jest.mock("../src/services/mongoAuth.service", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
}));

jest.mock("../src/utils/jwt", () => ({
  generateToken: jest.fn(() => "new-access-token"),
}));

jest.mock("../src/services/mongoRefreshToken.service", () => ({
  createNewRefreshToken: jest.fn(),
  validateRefreshToken: jest.fn(),
  revokeRefreshToken: jest.fn(),
}));

jest.mock("../src/models/user.model", () => ({
  findById: jest.fn(),
}));

const { generateToken } = require("../src/utils/jwt");
const {
  validateRefreshToken,
  revokeRefreshToken,
} = require("../src/services/mongoRefreshToken.service");
const User = require("../src/models/user.model");

const { refresh, logout } = require("../src/controllers/mongoAuth.controller");

const app = express();
app.use(express.json());
app.post("/refresh", refresh);
app.post("/logout", logout);

// Use predictable JSON errors in this isolated test app.
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Refresh token controller", () => {
  test("should return 400 when refresh token is missing", async () => {
    const response = await request(app).post("/refresh").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Refresh token is required");
    expect(validateRefreshToken).not.toHaveBeenCalled();
  });

  test("should return a new access token for a valid refresh token", async () => {
    validateRefreshToken.mockResolvedValue({
      token: "valid-refresh-token",
      userId: "user-123",
      expiresAt: new Date(Date.now() + 60_000),
    });

    User.findById.mockResolvedValue({
      _id: "user-123",
      name: "Test User",
      email: "test@example.com",
      role: "user",
    });

    generateToken.mockReturnValue("new-access-token");

    const response = await request(app)
      .post("/refresh")
      .send({ refreshToken: "valid-refresh-token" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBe("new-access-token");
    expect(validateRefreshToken).toHaveBeenCalledWith("valid-refresh-token");
    expect(User.findById).toHaveBeenCalledWith("user-123");
    expect(generateToken).toHaveBeenCalled();
  });

//   test("should reject an invalid refresh token", async () => {
//     validateRefreshToken.mockRejectedValue(new Error("Invalid refresh token"));

//     const response = await request(app)
//       .post("/refresh")
//       .send({ refreshToken: "invalid-token" });

//     // Current implementation may return 500 because the service throws
//     // a plain Error. We'll use this test to identify that issue.
//    // expect([401, 500]).toContain(response.status);
//    expect(response.status).toBe(401);
//    expect(response.body.message).toBe("Invalid refresh token");
//   });

test("should reject an invalid refresh token", async () => {
  validateRefreshToken.mockRejectedValue(
    Object.assign(new Error("Invalid refresh token"), {
      statusCode: 401,
    }),
  );

  const response = await request(app)
    .post("/refresh")
    .send({ refreshToken: "invalid-token" });

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe("Invalid refresh token");
});


  test("should return 401 when the user no longer exists", async () => {
    validateRefreshToken.mockResolvedValue({
      token: "valid-refresh-token",
      userId: "deleted-user",
      expiresAt: new Date(Date.now() + 60_000),
    });

    User.findById.mockResolvedValue(null);

    const response = await request(app)
      .post("/refresh")
      .send({ refreshToken: "valid-refresh-token" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("User no longer exists");
  });
});

describe("Logout controller", () => {
  test("should return 400 when refresh token is missing", async () => {
    const response = await request(app).post("/logout").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Refresh token is required");
    expect(revokeRefreshToken).not.toHaveBeenCalled();
  });

  test("should revoke a supplied refresh token", async () => {
    revokeRefreshToken.mockResolvedValue(undefined);

    const response = await request(app)
      .post("/logout")
      .send({ refreshToken: "refresh-token-to-revoke" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Logout successful");
    expect(revokeRefreshToken).toHaveBeenCalledWith("refresh-token-to-revoke");
  });
});
