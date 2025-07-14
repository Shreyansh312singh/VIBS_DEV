// backend server
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt"; // Only needed if you're using it later
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"; // Make sure this file exists and exports a working connectDB()
import { Investor } from "./models/Investor.model.js";
import { Company } from "./models/Company.model.js";
import cloudinary from "./config/cloudinary.js";
import {BusinessPitch }from "./models/Pitch.model.js";
import upload from './config/multer.js'; // multer setup
import { DealRequest } from "./models/Request.model.js";
import { EthPayment } from "./models/Eth.model.js";
dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//test
app.post('/fetch-pdf', async (req, res) => {
  const { pdfUrl } = req.body;

  if (!pdfUrl) {
    return res.status(400).json({ error: 'Missing pdfUrl in request body' });
  }

  try {
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch PDF from Cloudinary' });
    }

    const buffer = await response.buffer();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="fetched.pdf"',
    });

    return res.send(buffer);
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//company dekhani wali api different email pe to companies users
app.get('/api/business/by-email', async (req, res) => {
  const { email } = req.query;
  console.log(email);
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const pitches = await BusinessPitch.find({ email });
    if (!pitches || pitches.length === 0)
      return res.status(404).json({ message: "No pitches found" });

    res.status(200).json(pitches);
  } catch (error) {
    console.error("Fetch pitch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET business pitch by ID
app.get("/api/business/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pitch = await BusinessPitch.findById(id);
    if (!pitch) {
      return res.status(404).json({ message: "Business pitch not found" });
    }

    res.json({
      _id: pitch._id,
      email: pitch.email,
      companyName: pitch.companyName,
      website: pitch.website,
      sector: pitch.sector,
      stage: pitch.stage,
      pitchSummary: pitch.pitchSummary,
      fundingNeeded: pitch.fundingNeeded,
      equityOffered: pitch.equityOffered,
      pitchDeckUrl: pitch.pitchDeckUrl, // make sure this is the PDF URL field
    });
  } catch (err) {
    console.error("Error fetching business pitch:", err);
    res.status(500).json({ message: "Server error" });
  }
});


//investor ko company dikhne wali
app.get('/api/businesses', async (req, res) => {
  try {
    const businesses = await BusinessPitch.find();
    res.status(200).json(businesses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch business data" });
  }
});

// pdf wali api
app.post('/api/business/submit', upload.single('pitchDeck'), async (req, res) => {
  try {
    const {
      founderName,
      email,
      phone,
      companyName,
      website,
      sector,
      stage,
      pitchSummary,
      fundingNeeded,
      equityOffered,
    } = req.body;

    // Cloudinary file URL
    const pitchDeckUrl = req.file?.path;

    const newPitch = new BusinessPitch({
      founderName,
      email,
      phone,
      companyName,
      website,
      sector,
      stage,
      pitchSummary,
      fundingNeeded,
      equityOffered,
      pitchDeckUrl,
    });

    await newPitch.save();

    res.status(201).json({ message: 'Pitch submitted successfully!' });
  } catch (error) {
    console.error('Pitch submission error:', error);
    res.status(500).json({ message: 'Failed to submit pitch' });
  }
});




//investor ki signup  api hai ye
app.post('/Investor-signup', async (req, res) => {
  const { fullName, email, phone, password, linkedinUrl, companyName, agreedToTerms } = req.body;

  // Check required fields
  if (!fullName || !email || !phone || !password || !agreedToTerms) {
    return res.status(400).json({ message: 'Please fill all required fields and accept terms.' });
  }
  //console.log(fullName);

  try {
    // Check if email already exists
    const existingInvestor = await Investor.findOne({ email });
    if (existingInvestor) {
      return res.status(409).json({ message: 'Investor with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new investor
    const newInvestor = new Investor({
      fullName,
      email,
      phone,
      password: hashedPassword,
      linkedinUrl,
      companyName,
      agreedToTerms,
    });

    await newInvestor.save();

    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

//investor ki sign in verify karne wali api hai ye
app.post("/api/investor/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find investor by email
    const investor = await Investor.findOne({ email });
    if (!investor) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password (assuming you hashed it on signup)
    const isMatch = await bcrypt.compare(password, investor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Successful login
    res.status(200).json({ message: "Signin successful" ,email: investor.email});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//company signup karne wali api hai ye
app.post('/company-signup', async (req, res) => {
  const { name, founderName, email, password, registrationNumber, location } = req.body;

  // Check if all required fields are present
  if (!name || !founderName || !email || !password || !registrationNumber || !location) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if email or registration number already exists
    const existingEmail = await Company.findOne({ email });
    const existingReg = await Company.findOne({ registrationNumber });

    if (existingEmail) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    if (existingReg) {
      return res.status(409).json({ message: 'Registration number already used.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new company
    const newCompany = new Company({
      name,
      founderName,
      email,
      password: hashedPassword,
      registrationNumber,
      location,
    });

    await newCompany.save();
    res.status(201).json({ message: 'Company registered successfully!' });

  } catch (err) {
    console.error('Company Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

//company ko verify karke login karne wali api
app.post('/company-signin', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({ message: 'Company not found.' });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Successful signin
    res.status(200).json({ 
      message: 'Signin successful', 
      email: company.email   // returning email instead of companyId
    });

  } catch (err) {
    console.error('Signin Error:', err);
    res.status(500).json({ message: 'Server error during signin.' });
  }
});


//api company profile ke liye
app.get('/api/company/profile', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const company = await Company.findOne({ email }).select("name founderName email location registrationNumber");
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

// ✅ POST /api/deal/status — Check if deal exists
app.post("/status", async (req, res) => {
  const { investorEmail, companyName } = req.body;

  if (!investorEmail || !companyName) {
    return res.status(400).json({ error: "Missing investorEmail or companyName" });
  }

  try {
    const deal = await DealRequest.findOne({
      investorEmail: investorEmail.toLowerCase(),
      companyName: companyName,
    });
    console.log(investorEmail);
    console.log(companyName);
    if(deal){
      console.log("chutiya");
    }
    else{
      console.log("no chutiya");
    }

    if (deal) {
      return res.status(200).json({ status: "pending" });
    } else {
      return res.status(200).json({ status: "none" });
    }
  } catch (err) {
    console.error("Error checking deal status:", err);
    return res.status(500).json({ error: "Server error" });
  }
});


// request by investor
app.post("/request", async (req, res) => {
  const { investorEmail, companyEmail, companyName } = req.body;

  try {
    // Step 1: Prevent duplicate requests
    const existing = await DealRequest.findOne({ investorEmail, companyName });
    if (existing) {
      return res.status(200).json({ status: "already_exists" });
    }

    // Step 2: Fetch investor profile from Investor model
    const investor = await Investor.findOne({ email: investorEmail.toLowerCase() });
    if (!investor) {
      return res.status(404).json({ error: "Investor profile not found" });
    }

    // Step 3: Create new DealRequest
    const newDeal = new DealRequest({
      investorEmail: investor.email,
      investorName: investor.fullName,
      phone: investor.phone,
      linkedinUrl: investor.linkedinUrl,
      investorCompany: investor.companyName,
      companyEmail,
      companyName,
      status: "pending",
    });

    await newDeal.save();

    res.status(201).json({ success: true, message: "Deal initiated", deal: newDeal });
  } catch (err) {
    console.error("Error saving deal:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Get all investor info for a given companyEmail
app.get("/confirm-deal/:companyEmail", async (req, res) => {
  const { companyEmail } = req.params;

  try {
    const deals = await DealRequest.find({ companyEmail: companyEmail.toLowerCase() }).select(
      "investorEmail investorName phone linkedinUrl investorCompany companyName"
    );

    res.status(200).json(deals);
  } catch (err) {
    console.error("Error fetching deals for company:", err);
    res.status(500).json({ error: "Failed to fetch investor data" });
  }
});

// Save payment and delete deal
app.post("/eth/confirm", async (req, res) => {
  const { investorEmail, companyEmail, companyName, requestId } = req.body;
  console.log(investorEmail);
  console.log(companyEmail);
  console.log(companyName);
  console.log(requestId);
  try {
    const payment = new EthPayment({ investorEmail, companyEmail, companyName, requestId });
    await payment.save();
    console.log("good");

    // Remove from deal requests
    await DealRequest.findOneAndDelete({ investorEmail, companyEmail });

    res.status(200).json({ message: "Payment confirmed and deal removed" });
  } catch (err) {
    console.error("Error in ETH confirm route:", err);
    res.status(500).json({ error: "Server error confirming payment" });
  }
});

// Route to get all deals for an investor
app.get("/eth/deals/:investorEmail", async (req, res) => {
  try {
    const { investorEmail } = req.params;
    const deals = await EthPayment.find({ investorEmail });
    res.status(200).json(deals);
  } catch (err) {
    res.status(500).json({ message: "Error fetching deals", error: err });
  }
});

// backend/routes/eth.js (or wherever you're routing)

app.post("/eth/delete-deal", async (req, res) => {
  const { companyName } = req.body;

  try {
    // Delete from EthPayment
    await EthPayment.deleteMany({ companyName });

    // Delete from BusinessPitch
    await BusinessPitch.deleteMany({ companyName });

    res.json({ message: "Deal and business pitch deleted." });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// Start server
app.listen(5000, () => {
    connectDB(); // Make sure this connects properly
    console.log("Server started at http://localhost:5000");
});
