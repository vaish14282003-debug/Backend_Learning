require("dotenv").config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const config = {
  port: Number(process.env.PORT) || 3001,

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",

  databaseUrl: process.env.DATABASE_URL,

  nodeEnv: process.env.NODE_ENV || "development",
};

module.exports = config;
