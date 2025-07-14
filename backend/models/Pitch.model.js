// models/BusinessPitch.model.js
import mongoose from 'mongoose';

const businessPitchSchema = new mongoose.Schema({
  founderName: { type: String, required: true },                   // Full name of the founder
  email: { type: String, required: true, lowercase: true },        // Email of the founder
  phone: { type: String, required: true },                         // Phone number
  companyName: { type: String, required: true },                   // Company name
  website: { type: String },                                       // Optional company website
  sector: { type: String, required: true },                        // Sector e.g., FinTech, Health
  stage: { type: String, required: true },                         // Startup stage e.g., Idea, Seed
  pitchSummary: { type: String, required: true },                  // Short pitch description
  fundingNeeded: { type: Number, required: true },                 // Amount of funding needed
  equityOffered: { type: Number, required: true },                 // Equity percentage offered
  pitchDeckUrl: { type: String, required: true },                  // Cloudinary URL of uploaded pitch deck PDF
  createdAt: { type: Date, default: Date.now }                     // Submission timestamp
});

export const BusinessPitch = mongoose.model('BusinessPitch', businessPitchSchema);