import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../Utils/generateTokenAndSetCookie.js";
import User from "../Models/user.model.js";

const isValidEmail = (email) => /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);

export const signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    campus,
    role,
  } = req.body;

  try {
    if (!isValidEmail(email))
      return res.status(400).json({ error: "Invalid email format" });
    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords don't match" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      campus,
      role: role || "User",
      status: role === "CampusAdmin" ? "Approved" : "Pending",
    });

    await newUser.save();
    console.log("User saved successfully");

    generateTokenAndSetCookie(newUser._id, res);
    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ error: "Invalid email or password" });

    if (user.status !== "Approved")
      return res.status(403).json({ error: "Account not approved yet." });

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.status = "Approved";
    await user.save();
    res.status(200).json({ message: "User approved" });
  } catch (error) {
    console.error("Error in approveUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const promoteDemoteUser = async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.role = role;
    await user.save();
    res.status(200).json({ message: `User role updated to ${role}` });
  } catch (error) {
    console.error(" Error in promoteDemoteUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
