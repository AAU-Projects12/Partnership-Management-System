import { validationResult } from "express-validator";
import Partnership from "../Models/partnershipModel.js";

// Create a new partnership (User with active status, Admin, SuperAdmin)
export const createPartnership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Temporarily comment out for testing
    if (req.user.role === "User" && req.user.status !== "active") {
      return res.status(403).json({ error: "User account not active" });
    }

    const partnership = new Partnership({
      ...req.body,
      campusId: req.user.campusId,
      createdBy: req.user.userId,
      status: req.user.role === "User" ? "Pending" : "Active",
    });
    await partnership.save();
    res
      .status(201)
      .json({ message: "Partnership created successfully", partnership });
  } catch (error) {
    console.error("Error creating partnership:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all partnerships (Admin/SuperAdmin, filtered by campus for Admins)
export const getPartnerships = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, region, category } = req.query;
    let filter = req.user.role === "SuperAdmin" ? {} : { campusId: req.user.campusId };

    if (status) filter.status = status;
    if (region) filter.region = region;
    if (category) filter.category = category;

    const partnerships = await Partnership.find(filter);
    res.status(200).json(partnerships);
  } catch (error) {
    console.error("Error fetching partnerships:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single partnership by ID (Admin/SuperAdmin, campus-restricted for Admins)
export const getPartnershipById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filter = req.user.role === "SuperAdmin" 
      ? { _id: req.params.id }
      : { _id: req.params.id, campusId: req.user.campusId };
    const partnership = await Partnership.findOne(filter);
    
    if (!partnership) {
      return res.status(404).json({ message: "Partnership not found or not in your campus" });
    }
    res.status(200).json(partnership);
  } catch (error) {
    console.error("Error fetching partnership:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a partnership by ID (Admin/SuperAdmin, campus-restricted for Admins)
export const updatePartnership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filter = req.user.role === "SuperAdmin" 
      ? { _id: req.params.id }
      : { _id: req.params.id, campusId: req.user.campusId };
    const updatedPartnership = await Partnership.findOneAndUpdate(
      filter,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPartnership) {
      return res.status(404).json({ message: "Partnership not found or not in your campus" });
    }

    res.status(200).json({
      message: "Partnership updated successfully",
      updatedPartnership,
    });
  } catch (error) {
    console.error("Error updating partnership:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a partnership by ID (Admin/SuperAdmin, campus-restricted for Admins)
export const deletePartnership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filter = req.user.role === "SuperAdmin" 
      ? { _id: req.params.id }
      : { _id: req.params.id, campusId: req.user.campusId };
    const deletedPartnership = await Partnership.findOneAndDelete(filter);

    if (!deletedPartnership) {
      return res.status(404).json({ message: "Partnership not found or not in your campus" });
    }

    res.status(200).json({ message: "Partnership deleted successfully" });
  } catch (error) {
    console.error("Error deleting partnership:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Renew partnership (Admin/SuperAdmin, campus-restricted for Admins)
export const renewPartnership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filter = req.user.role === "SuperAdmin" 
      ? { _id: req.params.id }
      : { _id: req.params.id, campusId: req.user.campusId };
    const partnership = await Partnership.findOne(filter);
    
    if (!partnership) {
      return res.status(404).json({ message: "Partnership not found or not in your campus" });
    }

    partnership.expiringDate = req.body.expiringDate;
    partnership.MOUFile = req.body.MOUFile;
    await partnership.save();

    res.status(200).json({
      message: "Partnership renewed successfully",
      updatedPartnership: partnership,
    });
  } catch (error) {
    console.error("Error renewing partnership:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

// Export partnerships (Admin/SuperAdmin, campus-restricted for Admins, Day 1 task)
export const exportPartnerships = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filter = req.user.role === "SuperAdmin" 
      ? {} 
      : { campusId: req.user.campusId };
    const partnerships = await Partnership.find(filter);

    // TODO: Format for export (e.g., CSV, PDF) per SRS UC-15
    res.status(200).json(partnerships); // Placeholder: return JSON for now
  } catch (error) {
    console.error("Error exporting partnerships:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export default {
  createPartnership,
  getPartnerships,
  getPartnershipById,
  updatePartnership,
  deletePartnership,
  renewPartnership,
  exportPartnerships,
};