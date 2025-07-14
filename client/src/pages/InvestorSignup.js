import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/InvestorSignup.css';

export default function InvestorSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    linkedinUrl: "",
    companyName: "",
    agreedToTerms: false,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { fullName, email, phone, password, agreedToTerms } = formData;

    if (!fullName || !email || !phone || !password || !agreedToTerms) {
      setError("Please fill all required fields and accept terms.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/Investor-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful!");
        navigate("/investor-signin");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error during signup");
    }
  };

  return (
    <div className="container">
      <h2>Investor Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="url" name="linkedinUrl" placeholder="LinkedIn Profile (optional)" value={formData.linkedinUrl} onChange={handleChange} />
        <input type="text" name="companyName" placeholder="Company Name (optional)" value={formData.companyName} onChange={handleChange} />
        <label>
          <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} />
          I agree to the Terms and Conditions
        </label>
        <button type="submit">Signup</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}