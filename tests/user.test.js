jest.mock("../src/routes/mongoUpload.route", () => {
  const express = require("express");
  return express.Router();
});

jest.mock("../src/routes/user.route", () => require("express").Router());
jest.mock("../src/routes/auth.route", () => require("express").Router());
jest.mock("../src/routes/upload.route", () => require("express").Router());
jest.mock("../src/routes/job.route", () => require("express").Router());
jest.mock("../src/routes/mongoAuth.route", () => require("express").Router());
jest.mock("../src/routes/mongoProtected.route", () =>
  require("express").Router(),
);
jest.mock("../src/routes/mongoPost.route", () => require("express").Router());
jest.mock("../src/routes/mongoAdmin.route", () => require("express").Router());
jest.mock("../src/routes/mongoTransaction.route", () =>
  require("express").Router(),
);

jest.mock("../src/middleware/rateLimit.middleware", () => {
  const express = require("express");
  return (req, res, next) => next();
});

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");

const originalReadyState = mongoose.connection.readyState;

afterEach(() => {
  mongoose.connection.readyState = originalReadyState;
});

// describe("GET /health", () => {
//   test("should return 503 when MongoDB is disconnected", async () => {
//     const response = await request(app).get("/health");

//     expect(response.status).toBe(503);
//     expect(response.body.success).toBe(false);
//     expect(response.body.database).toBe("disconnected");
//   });
// });
describe("GET /health", () => {
  test("should return 503 when MongoDB is disconnected", async () => {
    mongoose.connection.readyState = 0;

    const response = await request(app).get("/health");

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.database).toBe("disconnected");
  });

  test("should return 200 when MongoDB is connected", async () => {
    mongoose.connection.readyState = 1;

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.database).toBe("connected");
  });

  test("should return the expected response structure", async () => {
    mongoose.connection.readyState = 1;

    const response = await request(app).get("/health");

    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        server: "healthy",
        database: "connected",
        timestamp: expect.any(String),
      }),
    );

    expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false);
  });

test("should return 400 for an invalid ID error", async () => {
  const testApp = express();

  testApp.get("/test-invalid-id", (req, res, next) => {
    const error = new Error("Cast failed");
    error.name = "CastError";

    next(error);
  });

  testApp.use(errorHandler);

  const response = await request(testApp).get("/test-invalid-id");

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    success: false,
    message: "Invalid ID format",
  });
});

test("should return 409 for a duplicate-key error", async () => {
  const testApp = express();

  testApp.get("/test-duplicate", (req, res, next) => {
    const error = new Error("Duplicate key");
    error.code = 11000;
    error.keyValue = { email: "test@example.com" };

    next(error);
  });

  testApp.use(errorHandler);

  const response = await request(testApp).get("/test-duplicate");

  expect(response.status).toBe(409);
  expect(response.body).toEqual({
    success: false,
    message: "email already exists",
  });
});

test("should return 400 for a Mongoose validation error", async () => {
  const testApp = express();

  testApp.get("/test-validation", (req, res, next) => {
    const error = new Error("Validation failed");
    error.name = "ValidationError";
    error.errors = {
      email: {
        path: "email",
        message: "Email is required",
      },
    };

    next(error);
  });

  testApp.use(errorHandler);

  const response = await request(testApp).get("/test-validation");

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    success: false,
    message: "Validation failed",
    errors: [
      {
        field: "email",
        message: "Email is required",
      },
    ],
  });
});

test("should return the provided status and message for an operational error", async () => {
  const testApp = express();

  testApp.get("/test-operational-error", (req, res, next) => {
    const error = new Error("User not found");
    error.statusCode = 404;

    next(error);
  });

  testApp.use(errorHandler);

  const response = await request(testApp).get("/test-operational-error");

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    success: false,
    message: "User not found",
  });
});
  test("should return 404 for an unknown route", async () => {
    const response = await request(app).get("/this-route-does-not-exist");

    expect(response.status).toBe(404);
  });
});

const express = require("express");
const errorHandler = require("../src/middleware/error.middleware");

describe("Global error handler", () => {
  test("should return 500 for an unexpected error", async () => {
    const testApp = express();

    testApp.get("/test-error", (req, res, next) => {
      next(new Error("Something went wrong"));
    });

    testApp.use(errorHandler);

    const response = await request(testApp).get("/test-error");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: "Internal server error",
    });
  });

});