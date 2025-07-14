import mongoose from "mongoose";

const investorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  linkedinUrl: {
    type: String,
    default: ""
  },
  companyName: {
    type: String,
    default: ""
  },
  agreedToTerms: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//const Investor = mongoose.model('Investor', investorSchema);

export const Investor = mongoose.model('Investor', investorSchema);
