const mongoose = require("mongoose");

async function connectMongoDB() {
  try {
    //await mongoose.connect(process.env.MONGO_URI);
    const config = require("./env");

    await mongoose.connect(config.mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectMongoDB;
