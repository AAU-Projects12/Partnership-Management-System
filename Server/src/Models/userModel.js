import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["Admin", "User"], // Removed "SuperAdmin"
      required: true,
      default: "User", // Default to "User"
    },
    campusId: {
      type: String,
      required: function () {
        return true; // Required for both Admin and User since no SuperAdmin
      },
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Skip hashing if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
  if (!this.isModified("password") || this.password.match(/^\$2[aby]\$/)) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;