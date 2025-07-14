// import React, { useEffect, useState } from "react";
// import "../css/Confirm.css";
// import { BrowserProvider, Contract, parseUnits } from "ethers";

// const CONTRACT_ADDRESS = "0x19D4877D43F4435ae74DDD845894bf9D6b937a79";
// let signer, contract;

// export default function ConfirmDeal() {
//   const [investors, setInvestors] = useState([]);
//   const [walletAddress, setWalletAddress] = useState("");
//   const companyEmail = localStorage.getItem("companyEmail");

//   useEffect(() => {
//     const fetchDeals = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/confirm-deal/${companyEmail}`);
//         console.log(companyEmail);
//         const data = await res.json();
//         if (res.ok) setInvestors(data);
//       } catch (err) {
//         console.error("Error fetching deal requests:", err);
//       }
//     };

//     if (companyEmail) fetchDeals();
//   }, [companyEmail]);

//   const connectWallet = async () => {
//     try {
//       if (window.ethereum) {
//         const provider = new BrowserProvider(window.ethereum);
//         signer = await provider.getSigner();
//         const address = await signer.getAddress();
//         setWalletAddress(address);

//         const abi = await fetch("/abi.json").then(res => res.json());
//         contract = new Contract(CONTRACT_ADDRESS, abi, signer);

//         alert("Wallet connected: " + address);
//       } else {
//         alert("Please install MetaMask.");
//       }
//     } catch (err) {
//       console.error("Wallet connection failed:", err);
//     }
//   };

//   const handleConfirmDeal = async (investor) => {
//     if (!contract || !signer) {
//       alert("Connect your wallet first.");
//       return;
//     }

//     try {
//       // Assume request is for 1 USD (100 cents)
//       const tx = await contract.createRequest(100); // 100 cents = $1
//       const receipt = await tx.wait();
//       const requestId = receipt.logs[0]?.args?.requestId?.toString();

//       // Post to eth model
//       await fetch("http://localhost:5000/eth/confirm", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           investorEmail: investor.email,
//           companyEmail,
//           companyName: investor.companyName,
//           requestId
//         })
//       });

     
//       alert("Deal confirmed and recorded on blockchain.");
//       setInvestors(prev => prev.filter(i => i.email !== investor.email));
//     } catch (err) {
//       console.error("Error confirming deal:", err);
//       alert("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <div className="confirm-deal-page">
//       <h2>Confirm Deals with Interested Investors</h2>

//       <button onClick={connectWallet}>
//         {walletAddress ? "Wallet Connected" : "Connect Wallet"}
//       </button>

//       <div className="investor-list">
//         {investors.length === 0 && <p>No deal requests pending.</p>}

//         {investors.map((inv, idx) => (
//           <div key={idx} className="investor-card">
//             <p><strong>Name:</strong> {inv.investorName}</p>
//             <p><strong>Email:</strong> {inv.investorEmail}</p>
//             <p><strong>Phone:</strong> {inv.phone}</p>
//             <p><strong>LinkedIn:</strong> <a href={inv.linkedinUrl} target="_blank" rel="noopener noreferrer">{inv.linkedinUrl}</a></p>
//             <p><strong>Investor Company:</strong> {inv.companyName}</p>
//             <button onClick={() => handleConfirmDeal(inv)}>Confirm Deal (Finalize)</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import "../css/Confirm.css";
// import { BrowserProvider, Contract, ethers } from "ethers";

// const CONTRACT_ADDRESS = "0x19D4877D43F4435ae74DDD845894bf9D6b937a79";
// let signer, contract;

// export default function ConfirmDeal() {
//   const [investors, setInvestors] = useState([]);
//   const [walletAddress, setWalletAddress] = useState("");
//   const [usdAmounts, setUsdAmounts] = useState({});
//   const [ethEstimates, setEthEstimates] = useState({});
//   const companyEmail = localStorage.getItem("companyEmail");

//   useEffect(() => {
//     const fetchDeals = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/confirm-deal/${companyEmail}`);
//         const data = await res.json();
//         if (res.ok) setInvestors(data);
//       } catch (err) {
//         console.error("Error fetching deal requests:", err);
//       }
//     };

//     if (companyEmail) fetchDeals();
//   }, [companyEmail]);

//   const connectWallet = async () => {
//     try {
//       if (window.ethereum) {
//         const provider = new BrowserProvider(window.ethereum);
//         signer = await provider.getSigner();
//         const address = await signer.getAddress();
//         setWalletAddress(address);

//         const abi = await fetch("/abi.json").then(res => res.json());
//         contract = new Contract(CONTRACT_ADDRESS, abi, signer);

//         alert("Wallet connected: " + address);
//       } else {
//         alert("Please install MetaMask.");
//       }
//     } catch (err) {
//       console.error("Wallet connection failed:", err);
//     }
//   };

//   const handleAmountChange = async (email, value) => {
//     const usd = parseFloat(value);
//     if (!isNaN(usd)) {
//       setUsdAmounts(prev => ({ ...prev, [email]: usd }));

//       // estimate ETH
//       try {
//         const cents = Math.round(usd * 100);
//         const wei = await contract.getEthAmount(cents);
//         const eth = ethers.formatEther(wei);
//         setEthEstimates(prev => ({ ...prev, [email]: eth }));
//       } catch (err) {
//         console.error("Error estimating ETH:", err);
//         setEthEstimates(prev => ({ ...prev, [email]: "Error" }));
//       }
//     }
//   };

//   const handleConfirmDeal = async (investor) => {
//     if (!contract || !signer) {
//       alert("Connect your wallet first.");
//       return;
//     }

//     const usd = usdAmounts[investor.email];
//     if (!usd || isNaN(usd)) {
//       alert("Please enter a valid USD amount.");
//       return;
//     }

//     const cents = Math.round(usd * 100);

//     try {
//       const tx = await contract.createRequest(cents);
//       const receipt = await tx.wait();
//       console.log("go");
//     const count = await contract.requestCount();
//     console.log("going");
//     console.log(count);
//     const requestId = Number(count) - 1;
//     console.log("gone");
//     console.log("✅ Latest Request ID:", requestId);
     
//       await fetch("http://localhost:5000/eth/confirm", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           investorEmail: investor.investorEmail,
//           companyEmail,
//           companyName: investor.companyName,
//           requestId
//         })
//       });

//       alert("Deal confirmed and recorded on blockchain.");
//       setInvestors(prev => prev.filter(i => i.email !== investor.email));
//     } catch (err) {
//       console.error("Error confirming deal:", err);
//       alert("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <div className="confirm-deal-page">
//       <h2>Confirm Deals with Interested Investors</h2>

//       <button onClick={connectWallet}>
//         {walletAddress ? "Wallet Connected" : "Connect Wallet"}
//       </button>

//       <div className="investor-list">
//         {investors.length === 0 && <p>No deal requests pending.</p>}

//         {investors.map((inv, idx) => (
//           <div key={idx} className="investor-card">
//             <p><strong>Name:</strong> {inv.investorName}</p>
//             <p><strong>Email:</strong> {inv.investorEmail}</p>
//             <p><strong>Phone:</strong> {inv.phone}</p>
//             <p><strong>LinkedIn:</strong> <a href={inv.linkedinUrl} target="_blank" rel="noopener noreferrer">{inv.linkedinUrl}</a></p>
//             <p><strong>Investor Company:</strong> {inv.companyName}</p>

//             <div className="deal-input">
//               <input
//                 type="number"
//                 min="1"
//                 step="0.01"
//                 placeholder="Enter USD amount"
//                 value={usdAmounts[inv.email] || ""}
//                 onChange={(e) => handleAmountChange(inv.email, e.target.value)}
//               />
//               {ethEstimates[inv.email] && (
//                 <p><strong>≈ ETH:</strong> {ethEstimates[inv.email]}</p>
//               )}
//             </div>

//             <button onClick={() => handleConfirmDeal(inv)}>
//               Confirm Deal (Finalize)
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import "../css/Confirm.css";
import { BrowserProvider, Contract, ethers } from "ethers";

const CONTRACT_ADDRESS = "0x19D4877D43F4435ae74DDD845894bf9D6b937a79";
let signer, contract;

export default function ConfirmDeal() {
  const [investors, setInvestors] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [usdAmounts, setUsdAmounts] = useState({});
  const [ethEstimates, setEthEstimates] = useState({});
  const companyEmail = localStorage.getItem("companyEmail");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch(`http://localhost:5000/confirm-deal/${companyEmail}`);
        const data = await res.json();
        if (res.ok) setInvestors(data);
      } catch (err) {
        console.error("Error fetching deal requests:", err);
      }
    };

    if (companyEmail) fetchDeals();
  }, [companyEmail]);

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

  const handleAmountChange = async (email, value) => {
    const usd = parseFloat(value);
    if (!isNaN(usd)) {
      setUsdAmounts(prev => ({ ...prev, [email]: usd }));

      try {
        const cents = Math.round(usd * 100);
        const wei = await contract.getEthAmount(cents);
        const eth = ethers.formatEther(wei);
        setEthEstimates(prev => ({ ...prev, [email]: eth }));
      } catch (err) {
        console.error("Error estimating ETH:", err);
        setEthEstimates(prev => ({ ...prev, [email]: "Error" }));
      }
    }
  };

  const handleConfirmDeal = async (investor) => {
    if (!contract || !signer) {
      alert("Connect your wallet first.");
      return;
    }

    const usd = usdAmounts[investor.investorEmail];
    if (!usd || isNaN(usd)) {
      alert("Please enter a valid USD amount.");
      return;
    }

    const cents = Math.round(usd * 100);

    try {
      const tx = await contract.createRequest(cents);
      const receipt = await tx.wait();

      const count = await contract.requestCount();
      const requestId = Number(count) - 1;

      console.log("✅ Request ID:", requestId);

      await fetch("http://localhost:5000/eth/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorEmail: investor.investorEmail,
          companyEmail,
          companyName: investor.companyName, // correct one here
          requestId
        })
      });

      alert("Deal confirmed and recorded on blockchain.");
      setInvestors(prev => prev.filter(i => i.investorEmail !== investor.investorEmail));
    } catch (err) {
      console.error("Error confirming deal:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="confirm-deal-page">
      <h2>Confirm Deals with Interested Investors</h2>

      <button onClick={connectWallet}>
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>

      <div className="investor-list">
        {investors.length === 0 && <p>No deal requests pending.</p>}

        {investors.map((inv, idx) => (
          <div key={idx} className="investor-card">
            <p><strong>Name:</strong> {inv.investorName}</p>
            <p><strong>Email:</strong> {inv.investorEmail}</p>
            <p><strong>Phone:</strong> {inv.phone}</p>
            <p><strong>LinkedIn:</strong> <a href={inv.linkedinUrl} target="_blank" rel="noopener noreferrer">{inv.linkedinUrl}</a></p>
            <p><strong>Company Name:</strong> {inv.companyName}</p>

            <div className="deal-input">
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter USD amount"
                value={usdAmounts[inv.investorEmail] || ""}
                onChange={(e) => handleAmountChange(inv.investorEmail, e.target.value)}
              />
              {ethEstimates[inv.investorEmail] && (
                <p><strong>≈ ETH:</strong> {ethEstimates[inv.investorEmail]}</p>
              )}
            </div>

            <button onClick={() => handleConfirmDeal(inv)}>
              Confirm Deal (Finalize)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
