import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../Utils/generateTokenAndSetCookie.js";
import User from "../Models/userModel.js";

const isValidEmail = (email) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, campusId, role } = req.body;
  try {
    console.log("Signup request body:", req.body);

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Allow specified role (SuperAdmin, Admin, User)
    const userRole = role || "User";
    console.log("Assigned role:", userRole);

    // Set status: active for SuperAdmin, pending for Admin/User
    const userStatus = userRole === "SuperAdmin" ? "active" : "pending";

    // Set campusId: null for SuperAdmin, required for others
    const userCampusId = userRole === "SuperAdmin" ? null : campusId || "default_campus";

    if (userRole !== "SuperAdmin" && !campusId) {
      return res.status(400).json({ error: "Campus ID is required for non-SuperAdmin users" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: userRole,
      campusId: userCampusId,
      status: userStatus,
    });
    console.log("Attempting to save user:", newUser);

    await newUser.save();
    generateTokenAndSetCookie(newUser, res);

    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      campusId: newUser.campusId,
      status: newUser.status,
    });

    console.log("User saved successfully");
  } catch (error) {
    console.error("Error in signup controller:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    generateTokenAndSetCookie(user, res);

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      campusId: user.campusId,
      status: user.status,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default { signup, login, logout };
