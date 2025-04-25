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
    console.log("Signup request body:", req.body); // Log request body

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

    // Set role: Allow SuperAdmin if specified, otherwise default to User
    const userRole = role === "SuperAdmin" ? "SuperAdmin" : "User";
    console.log("Assigned role:", userRole); // Log assigned role

    // Set status: Active for SuperAdmin, pending for others
    const userStatus = userRole === "SuperAdmin" ? "active" : "pending";

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: userRole,
      campusId: userRole === "SuperAdmin" ? null : campusId || "default_campus",
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
    });

    console.log("User saved successfully");
  } catch (error) {
    console.error("Error in signup controller:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

// Rest of the file (login, logout) remains unchanged
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
      email: user.email,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default { signup, login, logout };