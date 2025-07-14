import mongoose from 'mongoose';

const dealRequestSchema = new mongoose.Schema({
  investorEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
  investorName: String,
  phone: String,
  linkedinUrl: String,
  investorCompany: String,

  companyEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
  companyName: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const DealRequest = mongoose.model('DealRequest', dealRequestSchema);