const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Backend API",
      version: "1.0.0",
      description: "API documentation for the Node.js backend",
    },

    servers: [
      {
        url: "http://localhost:3001",
      },
    ],

    // components: {
    //   securitySchemes: {
    //     bearerAuth: {
    //       type: "http",
    //       scheme: "bearer",
    //       bearerFormat: "JWT",
    //     },
    //   },
    // },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      //   schemas: {
      // User: {
      //   type: "object",
      //   properties: {
      //     _id: {
      //       type: "string",
      //       example: "68c123456789abcdef123456",
      //     },
      //     name: {
      //       type: "string",
      //       example: "Vaishnavi",
      //     },
      //     email: {
      //       type: "string",
      //       format: "email",
      //       example: "vaishnavi@example.com",
      //     },
      //     role: {
      //       type: "string",
      //       enum: ["user", "admin"],
      //       example: "user",
      //     },
      //   },
      // },

      //     ErrorResponse: {
      //       type: "object",
      //       properties: {
      //         success: {
      //           type: "boolean",
      //           example: false,
      //         },
      //         message: {
      //           type: "string",
      //           example: "Validation failed",
      //         },
      //       },
      //     },
      //   },
      schemas: {
        Post: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "68c123456789abcdef123456",
            },
            title: {
              type: "string",
              example: "My first post",
            },
            content: {
              type: "string",
              example: "Learning backend development with Node.js and MongoDB",
            },
            userId: {
              type: "string",
              example: "68c123456789abcdef123456",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-10-07T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-10-07T10:30:00.000Z",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "68c123456789abcdef123456",
            },
            name: {
              type: "string",
              example: "Vaishnavi",
            },
            email: {
              type: "string",
              format: "email",
              example: "vaishnavi@example.com",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              example: "user",
            },
          },
        },

        RegisterResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "User registered successfully",
            },
            data: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Login successful",
            },
            data: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "68c123456789abcdef123456",
                },
                name: {
                  type: "string",
                  example: "Vaishnavi",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "vaishnavi@example.com",
                },
                role: {
                  type: "string",
                  enum: ["user", "admin"],
                  example: "user",
                },
                accessToken: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIs...",
                },
                refreshToken: {
                  type: "string",
                  example: "refresh-token-example",
                },
              },
            },
          },
        },
        MessageResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
          },
        },
        RefreshTokenResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Access token refreshed successfully",
            },
            data: {
              type: "object",
              properties: {
                accessToken: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIs...",
                },
              },
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Validation failed",
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.js", "./src/app.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
