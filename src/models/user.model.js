const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);
// userSchema.pre("save", function (next) {
//   console.log(`Saving user: ${this.email}`);
//   next();
// });
userSchema.virtual("displayName").get(function () {
  return `${this.name} (${this.role})`;
});
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};
// userSchema.pre("save", async function (next) {
//   // Don't hash password if it wasn't modified
//   if (!this.isModified("password")) {
//     return next();
//   }

//   this.password = await bcrypt.hash(this.password, 12);
// //12 is the bcrypt cose factor, which determines the computational cost of hashing. A higher value means more security but also more processing time.
//   next();
// });
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model("User", userSchema);
