
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/CompanyDisp.css';

export default function CompaniesData() {
  const [businesses, setBusinesses] = useState([]);
  const navigate = useNavigate();
  const investorEmail = localStorage.getItem("investorEmail");

  useEffect(() => {
    fetch("http://localhost:5000/api/businesses")
      .then(res => res.json())
      .then(data => setBusinesses(data))
      .catch(err => console.error("Error fetching businesses:", err));

    // ⛔ Prevent back navigation
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleDealClick = () => {
    if (investorEmail) {
      navigate(`/deal/${investorEmail}`);
    }
  };

  const handleExplore = async (id) => {
  try {
    // Step 1: Fetch business data from your Node.js API
    const res = await fetch(`http://localhost:5000/api/business/${id}`);
    const data = await res.json();

    console.log(data);
    console.log(data.email);
    console.log(investorEmail);
    console.log(data.companyName);
    console.log("done");
    if (!data.pitchDeckUrl) {
      alert("No pitch deck found.");
      return;
    }

    // Step 2: Start session on Flask server
    const flaskRes = await fetch("http://localhost:4000/start-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfUrl: data.pitchDeckUrl }),
    });
    const flaskData = await flaskRes.json();

    // Step 3: Navigate to chatbot page with sessionId
    if (flaskData.sessionId) {
      console.log("gone");
      navigate(`/chatcot/${flaskData.sessionId}`, {
      state: {
      companyEmail: data.email,
      investorEmail: investorEmail,
      companyName: data.companyName,
      },
      });
    }
     else {
      alert("Failed to create session.");
    }
  } catch (error) {
    console.log("problem");
    console.error("Error starting chat:", error);
  }
};


  const handleLogout = () => {
    localStorage.removeItem("investorEmail");
    navigate("/");
  };

  return (
    <div className="companies-container">
      <div className="navbar">
        <h2>Find Best Investment on Your Choice</h2>
        <button className="deal-button" onClick={handleDealClick}>
          Go to Deal
        </button>
      </div>

      <div className="business-list">
        {businesses.map((biz, index) => (
          <div key={index} className="business-card">
            <p><strong>Company:</strong> {biz.companyName}</p>
            <p><strong>Website:</strong> {biz.website}</p>
            <p><strong>Sector:</strong> {biz.sector}</p>
            <p><strong>Stage:</strong> {biz.stage}</p>
            <p><strong>Summary:</strong> {biz.pitchSummary}</p>
            <p><strong>Funding Needed:</strong> ₹{biz.fundingNeeded}</p>
            <p><strong>Equity Offered:</strong> {biz.equityOffered}%</p>
            <button className="explore-button" onClick={() => handleExplore(biz._id)}>
              Explore
            </button>
          </div>
        ))}
      </div>

      {/* 🔓 Logout Button in Bottom Left */}
      <button className="logout-btn-bottom" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
