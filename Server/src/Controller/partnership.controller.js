import Partnership from "../Models/partnership.model.js";
import { Parser } from "json2csv";

export const createPartnership = async (req, res) => {
  try {
    const partnership = new Partnership({
      ...req.body,
      campus: req.user.campus,
    });
    await partnership.save();
    res
      .status(201)
      .json({ message: "Partnership created successfully", partnership });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPartnerships = async (req, res) => {
  try {
    const { status, region, category, type, page = 1, limit = 10 } = req.query;
    let filter = { isArchive: false };
    if (status) filter.status = status;
    if (region) filter.region = region;
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (req.user.role === "CampusAdmin") filter.campus = req.user.campus;

    const partnerships = await Partnership.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Partnership.countDocuments(filter);
    res.status(200).json({ total, page, partnerships });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPartnershipById = async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership)
      return res.status(404).json({ message: "Partnership not found" });
    res.status(200).json(partnership);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePartnership = async (req, res) => {
  try {
    const updatedPartnership = await Partnership.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPartnership)
      return res.status(404).json({ message: "Partnership not found" });
    res.status(200).json({
      message: "Partnership updated successfully",
      updatedPartnership,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePartnership = async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership)
      return res.status(404).json({ message: "Partnership not found" });
    partnership.isArchive = true;
    await partnership.save();
    res.status(200).json({ message: "Partnership archived" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const renewPartnership = async (req, res) => {
  try {
    const { id } = req.params;
    const { expiringDate, MOUFile } = req.body;
    const partnership = await Partnership.findById(id);
    if (!partnership)
      return res.status(404).json({ message: "Partnership not found" });
    partnership.expiringDate = expiringDate;
    partnership.MOUFile = MOUFile;
    await partnership.save();
    res.status(200).json({
      message: "Partnership renewed successfully",
      updatedPartnership: partnership,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportPartnerships = async (req, res) => {
  try {
    const partnerships = await Partnership.find({ isArchive: false });
    const fields = [
      "partnersName",
      "email",
      "region",
      "category",
      "type",
      "status",
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(partnerships);
    res.header("Content-Type", "text/csv");
    res.attachment("partnerships.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
