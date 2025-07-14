import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/InvestorSignin.css';

export default function InvestorSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

try {
  const res = await fetch("http://localhost:5000/api/investor/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("investorEmail", data.email);
        console.log(data.email);
        navigate("/companies-data");
      } else {
        setError(data.message || "Signin failed");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="container">
      <h2>Investor Signin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
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
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}


