import '../css/pitch.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BusinessPitchForm = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    founderName: '',
    phone: '',
    companyName: '',
    website: '',
    sector: '',
    stage: '',
    pitchSummary: '',
    fundingNeeded: '',
    equityOffered: '',
    pitchDeck: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('founderName', formData.founderName);
    data.append('email', email);
    data.append('phone', formData.phone);
    data.append('companyName', formData.companyName);
    data.append('website', formData.website);
    data.append('sector', formData.sector);
    data.append('stage', formData.stage);
    data.append('pitchSummary', formData.pitchSummary);
    data.append('fundingNeeded', formData.fundingNeeded);
    data.append('equityOffered', formData.equityOffered);
    data.append('pitchDeck', formData.pitchDeck);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/business/submit',
        data,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      alert('Pitch submitted successfully!');

      // 🛑 Clear back history so they can't go back here
      navigate('/company-profile', { replace: true });
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Something went wrong.');
    }
  };

  // ⛔ Optional: Block accidental browser back button before submission
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="business-form-container">
      <h2>Submit Your Business Pitch</h2>
      <form onSubmit={handleSubmit} className="business-form">
        <input
          type="text"
          name="founderName"
          placeholder="Founder Name"
          value={formData.founderName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="website"
          placeholder="Website (optional)"
          value={formData.website}
          onChange={handleChange}
        />
        <input
          type="text"
          name="sector"
          placeholder="Business Sector"
          value={formData.sector}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="stage"
          placeholder="Startup Stage (e.g., Seed, Growth)"
          value={formData.stage}
          onChange={handleChange}
          required
        />
        <textarea
          name="pitchSummary"
          placeholder="Pitch Summary"
          value={formData.pitchSummary}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="number"
          name="fundingNeeded"
          placeholder="Funding Needed (in ₹)"
          value={formData.fundingNeeded}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="equityOffered"
          placeholder="Equity Offered (%)"
          value={formData.equityOffered}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="pitchDeck"
          accept="application/pdf"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          value={email}
          readOnly
          className="readonly-email"
        />

        <button type="submit">Submit Pitch</button>
      </form>
    </div>
  );
};

export default BusinessPitchForm;
