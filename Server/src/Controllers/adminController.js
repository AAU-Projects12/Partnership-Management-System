// import { validationResult } from "express-validator";
// import Partnership from "../Models/partnershipModel.js";

// export const getAllPartnerships = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const filter = req.user.role === "SuperAdmin" ? {} : { campusId: req.user.campusId };
//     const partnerships = await Partnership.find(filter);
//     res.status(200).json(partnerships);
//   } catch (error) {
//     console.error("Error fetching all partnerships:", error.message, error.stack);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export default { getAllPartnerships };

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateTokenAndSetCookie from "../Utils/generateTokenAndSetCookie.js";
import User from "../Models/userModel.js";

const isValidEmail = (email) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password:", { email, password });
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("Login attempt:", { email, password });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("Password check:", { isPasswordCorrect });

    if (!isPasswordCorrect) {
      console.log("Password mismatch for user:", email);
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

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.user;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { login, logout, resetPassword };