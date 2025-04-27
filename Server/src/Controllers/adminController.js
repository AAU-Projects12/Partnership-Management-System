import User from "../Models/userModel.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

// Approve a user (SuperAdmin approves Admins, Admins approve Users)
export const approveUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.status !== "pending") {
      return res.status(400).json({ error: "User is not in pending status" });
    }

    // SuperAdmin can approve Admins from any campus
    if (req.user.role === "SuperAdmin") {
      if (user.role === "SuperAdmin") {
        return res.status(400).json({ error: "Cannot approve SuperAdmin users" });
      }
    }
    // Admins can only approve Users from their own campus
    else if (req.user.role === "Admin") {
      if (user.role !== "User") {
        return res.status(403).json({ error: "Admins can only approve Users" });
      }
      if (user.campusId !== req.user.campusId) {
        return res.status(403).json({ error: "Can only approve Users from your campus" });
      }
    } else {
      return res.status(403).json({ error: "Unauthorized to approve users" });
    }

    user.status = "active";
    await user.save();

    res.status(200).json({
      message: "User approved successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error in approveUser:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Reject a user (SuperAdmin rejects Admins, Admins reject Users)
export const rejectUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.status !== "pending") {
      return res.status(400).json({ error: "User is not in pending status" });
    }

    // SuperAdmin can reject Admins from any campus
    if (req.user.role === "SuperAdmin") {
      if (user.role === "SuperAdmin") {
        return res.status(400).json({ error: "Cannot reject SuperAdmin users" });
      }
    }
    // Admins can only reject Users from their own campus
    else if (req.user.role === "Admin") {
      if (user.role !== "User") {
        return res.status(403).json({ error: "Admins can only reject Users" });
      }
      if (user.campusId !== req.user.campusId) {
        return res.status(403).json({ error: "Can only reject Users from your campus" });
      }
    } else {
      return res.status(403).json({ error: "Unauthorized to reject users" });
    }

    user.status = "inactive";
    await user.save();

    res.status(200).json({
      message: "User rejected successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        campusId: user.campusId,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error in rejectUser:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export default { approveUser, rejectUser };
