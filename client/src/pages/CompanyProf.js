import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CompanyProf.css";

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("companyEmail");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/company/profile?email=${email}`);
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError("Server error fetching profile");
      }
    };

    const fetchBusiness = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/business/by-email?email=${email}`);
        const data = await res.json();
        if (res.ok) {
          setBusinesses(data);
        }
      } catch (err) {
        console.error("Could not load business pitches");
      }
    };

    if (email) {
      fetchProfile();
      fetchBusiness();
    }

    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [email]);

  const handleBusinessClick = () => {
    navigate(`/bussiness/${email}`);
  };

  const handleConfirmDealClick = () => {
    navigate("/confirm-deal", { state: { companyEmail: email } });
  };

  const handleLogout = () => {
    localStorage.removeItem("companyEmail");
    navigate("/");
  };

  return (
    <div className="company-profile-container">
      <div className="company-profile-left">
        <h2>Company Profile</h2>
        {error && <p className="error">{error}</p>}
        {profile ? (
          <>
            <ul>
              <li><strong>Name:</strong> {profile.name}</li>
              <li><strong>Founder:</strong> {profile.founderName}</li>
              <li><strong>Email:</strong> {profile.email}</li>
              <li><strong>Location:</strong> {profile.location}</li>
              <li><strong>Reg. Number:</strong> {profile.registrationNumber}</li>
            </ul>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          !error && <p>Loading profile...</p>
        )}
      </div>

      <div className="company-profile-right">
        <div className="business-header">
          <button onClick={handleBusinessClick}>Business</button>
          <button onClick={handleConfirmDealClick} style={{ marginLeft: "10px", backgroundColor: "#28a745", color: "white" }}>
            Confirm Deal
          </button>
        </div>
        <div className="business-content">
          <h3>Business Data</h3>
          {businesses.length > 0 ? (
            businesses.map((biz, index) => (
              <div key={index} className="business-card">
                <p><strong>Company:</strong> {biz.companyName}</p>
                <p><strong>Website:</strong> {biz.website}</p>
                <p><strong>Sector:</strong> {biz.sector}</p>
                <p><strong>Stage:</strong> {biz.stage}</p>
                <p><strong>Summary:</strong> {biz.pitchSummary}</p>
                <p><strong>Funding Needed:</strong> {biz.fundingNeeded}</p>
                <p><strong>Equity Offered:</strong> {biz.equityOffered}</p>
              </div>
            ))
          ) : (
            <p>Not uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
