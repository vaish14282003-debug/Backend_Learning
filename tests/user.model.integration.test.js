const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let User;

beforeAll(async () => {
  //mongoServer = await MongoMemoryServer.create();
  mongoServer = await MongoMemoryServer.create({
    binary: { version: "7.0.14" },
  });
  await mongoose.connect(mongoServer.getUri(), {
    serverSelectionTimeoutMS: 5000,
  });

  // Load the model after the database connection is ready
  User = require("../src/models/user.model");
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);

beforeEach(async () => {
  await User.deleteMany({});
});

describe("User model integration", () => {
  test("should hash the password before saving", async () => {
    const user = await User.create({
      name: "Test User",
      email: "hash@example.com",
      password: "Password123!",
    });

    expect(user.password).not.toBe("Password123!");

    expect(await bcrypt.compare("Password123!", user.password)).toBe(true);

    const savedUser = await User.findOne({
      email: "hash@example.com",
    }).select("+password");

    expect(savedUser.password).not.toBe("Password123!");

    expect(await bcrypt.compare("Password123!", savedUser.password)).toBe(true);
  });

  test("should not hash the password again when it is unchanged", async () => {
    const user = await User.create({
      name: "Test User",
      email: "unchanged@example.com",
      password: "Password123!",
    });

    const originalHash = user.password;

    user.name = "Updated User";

    await user.save();

    expect(user.password).toBe(originalHash);

    expect(await bcrypt.compare("Password123!", user.password)).toBe(true);
  });

  test("should not return the password in a normal query", async () => {
    await User.create({
      name: "Test User",
      email: "hidden@example.com",
      password: "Password123!",
    });

    const user = await User.findOne({
      email: "hidden@example.com",
    });

    expect(user).not.toBeNull();
    expect(user.password).toBeUndefined();
  });
});
