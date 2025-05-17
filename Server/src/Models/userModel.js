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
      minlength: 8, // Updated to enforce 8 characters
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin"], // Removed "User"
      required: true,
      default: "Admin",
    },
    campusId: {
      type: String,
      required: function () {
        return this.role !== "SuperAdmin";
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
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12); // Changed to 12
  next();
});

const User = mongoose.model("User", userSchema);

export default User;