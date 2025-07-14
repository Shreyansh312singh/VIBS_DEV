import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';
import InvestorSignup from './pages/InvestorSignup';
import InvestorSignin from './pages/InvestorSignin';
import BusinessSignup from './pages/BusinessSignup';
import BusinessSignin from './pages/BusinessSignin';
import CompaniesData from './pages/CompanyDisp';
import CompanyProfile from './pages/CompanyProf';
import BusinessPitchForm from './pages/Pitch';
import ChatbotPage from './pages/Chatbot';
import ConfirmDeal from './pages/Confirm';
import InvestorPayment from './pages/Payment';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/investor-signup" element={<InvestorSignup />} />
      <Route path="/investor-signin" element={<InvestorSignin />} />
      <Route path="/business-signup" element={<BusinessSignup />} />
      <Route path="/business-signin" element={<BusinessSignin />} />
      <Route path="/companies-data" element={<CompaniesData />} />
      <Route path="/company-profile" element={<CompanyProfile />} />
      <Route path="/bussiness/:email" element={<BusinessPitchForm />} />
      <Route path="/chatcot/:sessionId" element={<ChatbotPage />} />
      <Route path="/confirm-deal" element={<ConfirmDeal/>} />
      <Route path="/deal/:investorEmail" element={<InvestorPayment/>} />
    </Routes>
  );
}

export default App;
