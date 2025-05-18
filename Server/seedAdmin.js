import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/Models/user.model.js";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/partnership";

async function seedAdmin() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const email = "admin@example.com";
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin user already exists.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("password123", 10);
  const admin = new User({
    firstName: "Admin",
    lastName: "User",
    email,
    password: hashedPassword,
    role: "SuperAdmin",
    campusId: "123456",
    status: "active",
  });
  await admin.save();
  console.log("Admin user seeded successfully.");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
