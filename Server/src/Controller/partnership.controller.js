import Partnership from "../Models/partnership.model.js";

// ✅ Create a new partnership
export const createPartnership = async (req, res) => {
  try {
    const partnership = new Partnership(req.body);
    await partnership.save();
    res
      .status(201)
      .json({ message: "Partnership created successfully", partnership });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all partnerships (with optional filters)
export const getPartnerships = async (req, res) => {
  try {
    const { status, region, category } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (region) filter.region = region;
    if (category) filter.category = category;

    const partnerships = await Partnership.find(filter);
    res.status(200).json(partnerships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a single partnership by ID
export const getPartnershipById = async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) {
      return res.status(404).json({ message: "Partnership not found" });
    }
    res.status(200).json(partnership);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a partnership by ID
export const updatePartnership = async (req, res) => {
  try {
    const updatedPartnership = await Partnership.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPartnership) {
      return res.status(404).json({ message: "Partnership not found" });
    }

    res.status(200).json({
      message: "Partnership updated successfully",
      updatedPartnership,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a partnership by ID
export const deletePartnership = async (req, res) => {
  try {
    const deletedPartnership = await Partnership.findByIdAndDelete(
      req.params.id
    );

    if (!deletedPartnership) {
      return res.status(404).json({ message: "Partnership not found" });
    }

    res.status(200).json({ message: "Partnership deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//renew partnership
export const renewPartnership = async (req, res) => {
  try {
    const { id } = req.params;
    const { expiringDate, MOUFile } = req.body; // MOUFile is now a string

    const partnership = await Partnership.findById(id);
    if (!partnership) {
      return res.status(404).json({ message: "Partnership not found" });
    }

    partnership.expiringDate = expiringDate;
    partnership.MOUFile = MOUFile; // ✅ Just store the new text

    await partnership.save();

    res.status(200).json({
      message: "Partnership renewed successfully",
      updatedPartnership: partnership,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
