import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },                        // Company name
  founderName: { type: String, required: true },                 // Founder name
  email: { type: String, required: true, unique: true },         // Login email
  password: { type: String, required: true },                    // Hashed password
  registrationNumber: { type: String, required: true, unique: true },          // Company registration number
  location: { type: String, required: true },                    // City or address
  createdAt: { type: Date, default: Date.now }                   // Auto timestamp
});

export const Company = mongoose.model('Company', companySchema);
