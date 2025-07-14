import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/BusinessSignup.css';

export default function BusinessSignup() {
  const [formData, setFormData] = useState({
    name: "",
    founderName: "",
    email: "",
    password: "",
    registrationNumber: "",
    location: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/company-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/business-signin");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="business-signup-container">
      <h2>Business Signup</h2>
      <form className="business-signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="founderName"
          placeholder="Founder's Name"
          value={formData.founderName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Business Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration Number"
          value={formData.registrationNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Company Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}