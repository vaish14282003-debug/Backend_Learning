const express = require("express");
const app = express();

const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const apiLimiter = require("./middleware/rateLimit.middleware");
const jobRoutes = require("./routes/job.route");
const mongoAuthRoutes = require("./routes/mongoAuth.route");

const uploadRoutes = require("./routes/upload.route");

app.use(express.json());
app.use(apiLimiter);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/uploads", uploadRoutes);
app.use("/jobs", jobRoutes);
//app.use("/auth", mongoAuthRoutes);
app.use("/api/mongo/auth", mongoAuthRoutes);
module.exports = app;
// app.use((err, req, res, next) => {
//   console.error(err.message);

//   if (err.message === "User not found") {
//     return res.status(404).json({
//       message: err.message,
//     });
//   }

//   res.status(500).json({
//     message: "Internal server error",
//   });
// });
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);

  // Invalid file type
  if (err.message === "Only JPG, PNG, and PDF files are allowed") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // File size exceeded
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size must not exceed 5 MB",
    });
  }

  // User not found
  if (err.message === "User not found") {
    return res.status(404).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;