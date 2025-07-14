import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/BusinessSignin.css';

export default function BusinessSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/company-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("companyEmail", data.email);
        console.log(data.email);
        navigate("/company-profile");
      } else {
        setError(data.message || "Signin failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="signin-container">
      <h2>Company Signin</h2>
      <form className="signin-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Company Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signin</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
