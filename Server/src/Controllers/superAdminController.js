import { validationResult } from "express-validator";
import User from "../Models/userModel.js";
import Partnership from "../Models/partnershipModel.js";
import bcrypt from "bcryptjs";

const generateRandomPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const assignAdmin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, firstName, lastName, campusId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const password = generateRandomPassword();
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: "Admin",
      campusId,
      status: "active",
    });

    await user.save();

    // Return response in the expected format
    res.status(200).json({
      message: "Admin assigned successfully",
      email: email,
      generatedPassword: password
    });

  } catch (error) {
    console.error("Error assigning admin:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllPartnerships = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const partnerships = await Partnership.find().lean();
    res.status(200).json({
      success: true,
      count: partnerships.length,
      data: partnerships
    });
  } catch (error) {
    console.error("Error fetching partnerships:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch partnerships",
      error: error.message
    });
  }
};

export default { assignAdmin, getAllPartnerships };