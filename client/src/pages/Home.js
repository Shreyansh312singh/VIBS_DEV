import React from 'react';
import '../css/Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="navbar-left" onClick={() => scrollToSection('about')}>
          VIBS
        </div>
        <div className="navbar-right">
          <button onClick={() => scrollToSection('investor')}>Want to be Investor</button>
          <button onClick={() => scrollToSection('business')}>Want to Enroll Business</button>
        </div>
      </nav>

      <section className="about-section" id="about">
        <h1>Welcome to VIBS</h1>
        <p>
          We provide an AI-powered interface that helps investors connect with small businesses
          and entrepreneurs. Our platform ensures transparency, performance tracking, and intelligent support.
        </p>
      </section>

      <section className="investor-section" id="investor">
        <h2>For Investors</h2>
        <p>Ready to explore opportunities and fund promising startups?</p>
        <div className="btn-group">
          <button onClick={() => navigate('/investor-signup')}>Signup</button>
          <button onClick={() => navigate('/investor-signin')}>Signin</button>
        </div>
      </section>

      <section className="business-section" id="business">
        <h2>For Business Owners</h2>
        <p>Want to present your idea to global investors? Join us today!</p>
        <div className="btn-group">
          <button onClick={() => navigate('/business-signup')}>Signup</button>
          <button onClick={() => navigate('/business-signin')}>Signin</button>
        </div>
      </section>
    </div>
  );
}

export default Home;
