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
      enum: ["SuperAdmin", "Admin", "User"], // Added "User"
      required: true,
      default: "User", // Changed default to "User" to match common use case
    },
    campusId: {
      type: String,
      required: function () {
        return this.role !== "SuperAdmin"; // Required for Admin and User
      },
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"], // Keep as is, but handle case sensitivity
      default: "pending",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;