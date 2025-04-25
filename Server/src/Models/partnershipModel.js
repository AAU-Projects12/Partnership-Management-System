import mongoose from "mongoose";

const partnershipSchema = new mongoose.Schema(
  {
    partnersName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    region: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    inceptionDate: {
      type: Date,
      required: true,
    },
    expiringDate: {
      type: Date,
      required: true,
    },
    aauLeadContact: {
      type: String,
      required: true,
    },
    partnerLeadContact: {
      type: String,
      required: true,
    },
    MOUFile: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Expired"],
      default: "Pending",
    },
    type: {
      type: String,
      required: true,
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
    campusId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Partnership = mongoose.model("Partnership", partnershipSchema);

export default Partnership;