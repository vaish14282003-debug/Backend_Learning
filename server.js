// require("dotenv").config();

// const app = require("./src/app");
// const connectMongoDB = require("./src/config/mongo");

// //const PORT = process.env.PORT || 3001;
// const config = require("./src/config/env");

// const PORT = config.port;
// connectMongoDB();

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
require("dotenv").config();

const app = require("./src/app");
const connectMongoDB = require("./src/config/mongo");
const config = require("./src/config/env");
const mongoose = require("mongoose");

const PORT = config.port;

async function startServer() {
  await connectMongoDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down...`);

    server.close(async () => {
      console.log("HTTP server closed");

      await mongoose.connection.close();

      console.log("MongoDB connection closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer();