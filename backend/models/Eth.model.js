// models/EthPayment.js
import mongoose from "mongoose";

const ethPaymentSchema = new mongoose.Schema({
  investorEmail: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  requestId: {
    type: Number,
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
});

export const EthPayment = mongoose.model("EthPayment", ethPaymentSchema);
