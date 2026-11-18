const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../src/models/user.model");

describe("User model password security", () => {


// test("should hash the password before saving", async () => {
//   const user = new User({
//     name: "Test User",
//     email: "test@example.com",
//     password: "Password123!",
//   });

//   // Mongoose validation runs before save hooks.
//   await user.validate();

//   // Run the registered pre-save hook directly.
//   await new Promise((resolve, reject) => {
//     const hookRunner = User.schema.s.hooks;
//     hookRunner.execPre("save", user, (error) => {
//       if (error) return reject(error);
//       resolve();
//     });
//   });

//   expect(user.password).not.toBe("Password123!");
//   expect(await bcrypt.compare("Password123!", user.password)).toBe(true);
// });

// test("should not hash the password again if it is not modified", async () => {
//   const user = new User({
//     name: "Test User",
//     email: "test2@example.com",
//     password: "Password123!",
//   });

//   // Simulate an existing document with a hashed password.
//   user.password = await bcrypt.hash("Password123!", 4);
//   user.$isNew = false;
//   user.$__.activePaths.clear("modify");

//   const existingHash = user.password;

//   await new Promise((resolve, reject) => {
//     User.schema.s.hooks.execPre("save", user, (error) => {
//       if (error) return reject(error);
//       resolve();
//     });
//   });

//   expect(user.password).toBe(existingHash);
// });


  test("should compare a correct password successfully", async () => {
    const password = "Password123!";
    const hash = await bcrypt.hash(password, 4);

    const user = new User({
      name: "Test User",
      email: "test3@example.com",
      password: hash,
    });

    await expect(user.comparePassword(password)).resolves.toBe(true);
  });

  test("should reject an incorrect password", async () => {
    const hash = await bcrypt.hash("Password123!", 4);

    const user = new User({
      name: "Test User",
      email: "test4@example.com",
      password: hash,
    });

    await expect(user.comparePassword("WrongPassword!")).resolves.toBe(false);
  });

  test("should hide the password field from default selection", () => {
    const passwordPath = User.schema.path("password");

    expect(passwordPath.options.select).toBe(false);
  });

  test("should provide a display name virtual", () => {
    const user = new User({
      name: "Test User",
      email: "test5@example.com",
      password: "Password123!",
      role: "admin",
    });

    expect(user.displayName).toBe("Test User (admin)");
  });
});
