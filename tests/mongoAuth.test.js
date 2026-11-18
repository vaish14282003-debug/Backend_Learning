const express = require("express");
const request = require("supertest");

const {
  registerJoiSchema,
  loginJoiSchema,
} = require("../src/validators/mongoAuth.joi.validator");

const joiValidate = require("../src/middleware/joiValidate.middleware");

describe("MongoDB authentication validation", () => {
  const app = express();

  app.use(express.json());

  // Test registration validation independently of MongoDB.
  app.post("/register", joiValidate(registerJoiSchema), (req, res) => {
    res.status(201).json({
      success: true,
      data: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  });

  // Test login validation independently of MongoDB.
  app.post("/login", joiValidate(loginJoiSchema), (req, res) => {
    res.status(200).json({
      success: true,
      message: "Validation passed",
    });
  });

  describe("POST /register", () => {
    test("should reject missing required fields", async () => {
      const response = await request(app).post("/register").send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });

    test("should reject an invalid email", async () => {
      const response = await request(app).post("/register").send({
        name: "Test User",
        email: "not-an-email",
        password: "StrongPass123",
      });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "email" })]),
      );
    });

    test("should reject an object instead of an email string", async () => {
      const response = await request(app)
        .post("/register")
        .send({
          name: "Test User",
          email: { $ne: null },
          password: "StrongPass123",
        });

      expect(response.status).toBe(400);
    });

    test("should accept valid registration input", async () => {
      const response = await request(app).post("/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "StrongPass123",
        unexpectedField: "should be removed",
      });

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe("test@example.com");
      expect(response.body.data).not.toHaveProperty("password");
      expect(response.body.data).not.toHaveProperty("unexpectedField");
    });
  });

  describe("POST /login", () => {
    test("should reject a missing password", async () => {
      const response = await request(app).post("/login").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
    });

    test("should reject an object instead of a password string", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          email: "test@example.com",
          password: { $ne: null },
        });

      expect(response.status).toBe(400);
    });

    test("should accept valid login input", async () => {
      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "StrongPass123",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).not.toHaveProperty("password");
    });
  });
});
