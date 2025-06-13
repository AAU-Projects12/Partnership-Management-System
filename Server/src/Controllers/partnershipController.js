import { validationResult } from "express-validator";
import Partnership from "../Models/partnershipModel.js";
import mongoose from "mongoose";

export const getAllPartnerships = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, typeOfOrganization, limit = 10, page = 1 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (typeOfOrganization)
      query["partnerInstitution.typeOfOrganization"] = typeOfOrganization;
    query.isArchived = false;

    if (req.user.role !== "SuperAdmin") {
      query.campusId = req.user.campusId;
    }

    const total = await Partnership.countDocuments(query);
    const partnerships = await Partnership.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.status(200).json({
      partnerships,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error in getAllPartnerships:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const createPartnership = async (req, res) => {
  try {
    const {
      name,
      type,
      signedDate,
      endDate,
      region,
      country,
      college,
      status,
      description,
      partnerInstitution,
      aauContact,
      partnerContactPerson,
      potentialStartDate,
      documentLink,
    } = req.body;

    // Parse JSON strings back to objects
    const parsedPartnerInstitution = JSON.parse(partnerInstitution);
    const parsedAauContact = JSON.parse(aauContact);
    const parsedPartnerContactPerson = JSON.parse(partnerContactPerson);

    const partnershipData = {
      name,
      type,
      signedDate,
      endDate,
      region,
      country,
      college,
      status,
      description,
      partnerInstitution: parsedPartnerInstitution,
      aauContact: parsedAauContact,
      partnerContactPerson: parsedPartnerContactPerson,
      potentialStartDate,
      documentLink,
    };

    const partnership = await Partnership.create(partnershipData);
    res.status(201).json({
      success: true,
      data: partnership,
    });
  } catch (error) {
    console.error("Partnership creation error:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getPartnerships = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      status,
      typeOfOrganization,
      potentialStartDate,
      durationOfPartnership,
      archived,
      limit = 10,
      page = 1,
    } = req.query;
    let filter =
      req.user.role === "SuperAdmin" ? {} : { campusId: req.user.campusId };

    if (status) filter.status = status;
    if (typeOfOrganization)
      filter["partnerInstitution.typeOfOrganization"] = typeOfOrganization;
    if (durationOfPartnership)
      filter.durationOfPartnership = durationOfPartnership;

    if (potentialStartDate) {
      if (!isValidDate(potentialStartDate)) {
        return res
          .status(400)
          .json({ error: "Invalid potential start date format" });
      }
      filter.potentialStartDate = { $gte: new Date(potentialStartDate) };
    }

    filter.isArchived = archived === "true" ? true : false;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    if (parsedLimit < 1 || parsedPage < 1) {
      return res
        .status(400)
        .json({ error: "Limit and page must be positive integers" });
    }
    if (parsedLimit > 100) {
      return res.status(400).json({ error: "Limit cannot exceed 100" });
    }

    const skip = (parsedPage - 1) * parsedLimit;
    const total = await Partnership.countDocuments(filter);
    const partnerships = await Partnership.find(filter)
      .skip(skip)
      .limit(parsedLimit);

    res.status(200).json({
      partnerships,
      pagination: {
        total,
        page: parsedPage,
        pages: Math.ceil(total / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching partnerships:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPartnershipById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filter =
      req.user.role === "SuperAdmin"
        ? { _id: req.params.id }
        : { _id: req.params.id, campusId: req.user.campusId };
    const partnership = await Partnership.findOne(filter);

    if (!partnership) {
      return res
        .status(404)
        .json({ message: "Partnership not found or not in your campus" });
    }
    res.status(200).json(partnership);
  } catch (error) {
    console.error("Error fetching partnership:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePartnership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filter =
      req.user.role === "SuperAdmin"
        ? { _id: req.params.id }
        : { _id: req.params.id, campusId: req.user.campusId };

    const updateData = {
      ...req.body,
      document: req.file
        ? {
            filename: req.file.filename,
            path: req.file.path,
          }
        : undefined,
    };
    if (
      Array.isArray(updateData.potentialAreasOfCollaboration) &&
      updateData.potentialAreasOfCollaboration.includes("Other") &&
      !updateData.otherCollaborationArea
    ) {
      return res.status(400).json({
        error: "Other collaboration area is required when 'Other' is selected",
      });
    }

    const updatedPartnership = await Partnership.findOneAndUpdate(
      filter,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPartnership) {
      return res
        .status(404)
        .json({ message: "Partnership not found or not in your campus" });
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

export const deletePartnership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filter =
      req.user.role === "SuperAdmin"
        ? { _id: req.params.id }
        : { _id: req.params.id, campusId: req.user.campusId };
    const deletedPartnership = await Partnership.findOneAndDelete(filter);

    if (!deletedPartnership) {
      return res
        .status(404)
        .json({ message: "Partnership not found or not in your campus" });
    }

    res.status(200).json({ message: "Partnership deleted successfully" });
  } catch (error) {
    console.error("Error deleting partnership:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const renewPartnership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filter =
      req.user.role === "SuperAdmin"
        ? { _id: req.params.id }
        : { _id: req.params.id, campusId: req.user.campusId };
    const partnership = await Partnership.findOne(filter);

    if (!partnership) {
      return res
        .status(404)
        .json({ message: "Partnership not found or not in your campus" });
    }

    partnership.potentialStartDate = new Date(req.body.potentialStartDate);
    partnership.durationOfPartnership = req.body.durationOfPartnership;
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

export const exportPartnerships = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filter =
      req.user.role === "SuperAdmin" ? {} : { campusId: req.user.campusId };
    const partnerships = await Partnership.find(filter);

    res.status(200).json(partnerships);
  } catch (error) {
    console.error("Error exporting partnerships:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const approvePartnership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid partnership ID" });
    }

    if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Only Admins or SuperAdmins can approve partnerships" });
    }

    const filter =
      req.user.role === "SuperAdmin"
        ? { _id: id }
        : { _id: id, campusId: req.user.campusId };

    const partnership = await Partnership.findOne(filter);
    if (!partnership) {
      return res
        .status(404)
        .json({ error: "Partnership not found or not in your campus" });
    }

    if (partnership.status !== "Pending") {
      return res
        .status(400)
        .json({ error: "Only pending partnerships can be approved" });
    }

    partnership.status = "Active";
    await partnership.save();

    res.status(200).json({
      message: "Partnership approved successfully",
      partnership,
    });
  } catch (error) {
    console.error("Error approving partnership:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const rejectPartnership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid partnership ID" });
    }

    if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Only Admins or SuperAdmins can reject partnerships" });
    }

    const filter =
      req.user.role === "SuperAdmin"
        ? { _id: id }
        : { _id: id, campusId: req.user.campusId };

    const partnership = await Partnership.findOne(filter);
    if (!partnership) {
      return res
        .status(404)
        .json({ error: "Partnership not found or not in your campus" });
    }

    if (partnership.status !== "Pending") {
      return res
        .status(400)
        .json({ error: "Only pending partnerships can be rejected" });
    }

    partnership.status = "Rejected";
    await partnership.save();

    res.status(200).json({
      message: "Partnership rejected successfully",
      partnership,
    });
  } catch (error) {
    console.error("Error rejecting partnership:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

export const archivePartnership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid partnership ID" });
    }

    const filter =
      req.user.role === "SuperAdmin"
        ? { _id: id }
        : { _id: id, campusId: req.user.campusId };

    const partnership = await Partnership.findOne(filter);
    if (!partnership) {
      return res
        .status(404)
        .json({ error: "Partnership not found or not in your campus" });
    }

    if (partnership.isArchived) {
      return res.status(400).json({ error: "Partnership is already archived" });
    }

    partnership.isArchived = true;
    await partnership.save();

    res.status(200).json({
      message: "Partnership archived successfully",
      partnership,
    });
  } catch (error) {
    console.error("Error archiving partnership:", error.message, error.stack);
    res.status(500).json({ error: "Server error" });
  }
};

function isValidDate(dateString) {
  return !isNaN(Date.parse(dateString));
}

export default {
  getAllPartnerships,
  createPartnership,
  getPartnerships,
  getPartnershipById,
  updatePartnership,
  deletePartnership,
  renewPartnership,
  exportPartnerships,
  approvePartnership,
  rejectPartnership,
  archivePartnership,
};
