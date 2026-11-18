const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const mongoUploadRoutes = require("./routes/mongoUpload.route");
//const mongoSanitize = require("express-mongo-sanitize");

const errorHandler = require("./middleware/error.middleware.js");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const apiLimiter = require("./middleware/rateLimit.middleware");
const jobRoutes = require("./routes/job.route");
const mongoAuthRoutes = require("./routes/mongoAuth.route");
const mongoProtectedRoutes = require("./routes/mongoProtected.route");
const mongoPostRoutes = require("./routes/mongoPost.route");
const mongoose = require("mongoose");

const uploadRoutes = require("./routes/upload.route");
const mongoAdminRoutes = require("./routes/mongoAdmin.route");
const mongoTransactionRoutes = require("./routes/mongoTransaction.route");
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Server is healthy",
//     timestamp: new Date().toISOString(),
//   });
// });
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check server and database health
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server and database are healthy
 *       503:
 *         description: Database is disconnected
 */
app.get("/health", (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;

  res.status(mongoConnected ? 200 : 503).json({
    success: mongoConnected,
    server: "healthy",
    database: mongoConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
);
//app.use(mongoSanitize());
app.use(apiLimiter);
app.use(helmet());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/uploads", uploadRoutes);
app.use("/jobs", jobRoutes);
//app.use("/api/mongo/auth", mongoAuthRoutes);
app.use("/api/mongo", mongoProtectedRoutes);
//app.use("/auth", mongoAuthRoutes);
app.use("/api/mongo/auth", mongoAuthRoutes);
app.use("/api/mongo/admin", mongoAdminRoutes);
app.use("/api/mongo/posts", mongoPostRoutes);
app.use("/api/mongo/transaction", mongoTransactionRoutes);
app.use("/api/mongo/uploads", mongoUploadRoutes);

// app.use((err, req, res, next) => {
//   console.error(err.message);

//   // Invalid file type
//   if (err.message === "Only JPG, PNG, and PDF files are allowed") {
//     return res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }

//   // File size exceeded
//   if (err.code === "LIMIT_FILE_SIZE") {
//     return res.status(400).json({
//       success: false,
//       message: "File size must not exceed 5 MB",
//     });
//   }

//   // User not found
//   if (err.message === "User not found") {
//     return res.status(404).json({
//       message: err.message,
//     });
//   }

//   return res.status(500).json({
//     success: false,
//     message: "Internal server error",
//   });
// });
app.use(errorHandler);

module.exports = app;
