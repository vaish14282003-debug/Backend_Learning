const express = require("express");
const request = require("supertest");

jest.mock("../src/services/mongoAuth.service", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
}));

jest.mock("../src/utils/jwt", () => ({
  generateToken: jest.fn(() => "test-access-token"),
}));

jest.mock("../src/services/mongoRefreshToken.service", () => ({
  createNewRefreshToken: jest.fn(),
  validateRefreshToken: jest.fn(),
  revokeRefreshToken: jest.fn(),
}));

const {
  registerUser,
  loginUser,
} = require("../src/services/mongoAuth.service");

const { generateToken } = require("../src/utils/jwt");

const {
  createNewRefreshToken,
} = require("../src/services/mongoRefreshToken.service");

const { register, login } = require("../src/controllers/mongoAuth.controller");

const errorHandler = require("../src/middleware/error.middleware");
const AppError = require("../src/utils/AppError");
const {
  registerJoiSchema,
  loginJoiSchema,
} = require("../src/validators/mongoAuth.joi.validator");

const joiValidate = require("../src/middleware/joiValidate.middleware");

const app = express();
app.use(express.json());

app.post("/register", joiValidate(registerJoiSchema), register);
app.post("/login", joiValidate(loginJoiSchema), login);

app.use(errorHandler);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("MongoDB authentication controller", () => {
  describe("POST /register", () => {
    test("should register a user and return safe user fields", async () => {
      registerUser.mockResolvedValue({
        _id: "user123",
        name: "Test User",
        email: "test@example.com",
        role: "user",
        password: "hashed-password",
      });

      const response = await request(app).post("/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "StrongPass123",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: "user123",
        name: "Test User",
        email: "test@example.com",
        role: "user",
      });
      expect(response.body.data).not.toHaveProperty("password");
      expect(registerUser).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "StrongPass123",
      });
    });

    test("should return 409 when the email already exists", async () => {
      registerUser.mockRejectedValue(new AppError("User already exists", 409));

      const response = await request(app).post("/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "StrongPass123",
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("POST /login", () => {
    test("should return access and refresh tokens for valid credentials", async () => {
      loginUser.mockResolvedValue({
        _id: "user123",
        name: "Test User",
        email: "test@example.com",
        role: "user",
      });

      createNewRefreshToken.mockResolvedValue({
        token: "test-refresh-token",
      });

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "StrongPass123",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBe("test-access-token");
      expect(response.body.data.refreshToken).toBe("test-refresh-token");
      expect(response.body.data).not.toHaveProperty("password");
      expect(generateToken).toHaveBeenCalled();
    });

    test("should return 401 for invalid credentials", async () => {
      loginUser.mockRejectedValue(
        new AppError("Invalid email or password", 401),
      );

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "WrongPass123",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
    });
  });
});
