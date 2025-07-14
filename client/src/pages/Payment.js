import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BrowserProvider, Contract, ethers } from "ethers";
import "../css/Payment.css";

const CONTRACT_ADDRESS = "0x19D4877D43F4435ae74DDD845894bf9D6b937a79";
let signer, contract;

export default function InvestorPayment() {
  const { investorEmail } = useParams();
  const [deals, setDeals] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");

  // Fetch deals for investor
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch(`http://localhost:5000/eth/deals/${investorEmail}`);
        const data = await res.json();
        if (res.ok) setDeals(data);
      } catch (err) {
        console.error("Error fetching deals:", err);
      }
    };

    if (investorEmail) fetchDeals();
  }, [investorEmail]);

  // Connect MetaMask
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        const abi = await fetch("/abi.json").then(res => res.json());
        contract = new Contract(CONTRACT_ADDRESS, abi, signer);

        alert("Wallet connected: " + address);
      } else {
        alert("Please install MetaMask.");
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  // Handle Pay + Delete from DB
  const handlePay = async (requestId, companyName) => {
    try {
      const request = await contract.requests(requestId);
      const requiredWei = await contract.getEthAmount(request.usdAmount);
      const tx = await contract.payRequest(requestId, { value: requiredWei });
      await tx.wait();

      // Delete from both models
      await fetch("http://localhost:5000/eth/delete-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
      });

      alert("✅ Payment successful and deal deleted.");
      setDeals(prev => prev.filter(d => d.requestId !== requestId));
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Payment failed.");
    }
  };

  return (
    <div className="confirm-deal-page">
      <h2>Pay Confirmed Deals</h2>
      <button onClick={connectWallet}>
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>

      <div className="investor-list">
        {deals.length === 0 && <p>No pending payments.</p>}

        {deals.map((deal, idx) => (
          <div key={idx} className="investor-card">
            <p><strong>Company Name:</strong> {deal.companyName}</p>
            <p><strong>Company Email:</strong> {deal.companyEmail}</p>
            {/* ❌ Request ID not shown */}
            <button onClick={() => handlePay(deal.requestId, deal.companyName)}>Pay</button>
          </div>
        ))}
      </div>
    </div>
  );
}
