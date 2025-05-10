import mongoose from "mongoose";

const partnershipSchema = new mongoose.Schema({
  partnersName: {
    type: String,
    required: [true, "Partner's name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  region: {
    type: String,
    required: [true, "Region is required"],
    enum: ["East Africa", "West Africa", "North Africa", "South Africa", "Central Africa", "Other"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Education", "Research", "Industry", "NGO", "Government", "Other"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
  },
  inceptionDate: {
    type: Date,
    required: [true, "Inception date is required"],
  },
  expiringDate: {
    type: Date,
    required: [true, "Expiring date is required"],
    validate: {
      validator: function (value) {
        return value > this.inceptionDate;
      },
      message: "Expiring date must be after inception date",
    },
  },
  aauLeadContact: {
    type: String,
    required: [true, "AAU lead contact is required"],
    trim: true,
  },
  partnerLeadContact: {
    type: String,
    required: [true, "Partner lead contact is required"],
    trim: true,
  },
  MOUFile: {
    type: String,
    required: [true, "MOU file is required"],
  },
  type: {
    type: String,
    required: [true, "Partnership type is required"],
    enum: ["Bilateral", "Multilateral", "Consortium", "Other"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Active", "Rejected"],
    default: "Pending",
  },
  campusId: {
    type: String,
    required: [true, "Campus ID is required"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Created by user ID is required"],
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("Partnership", partnershipSchema);
