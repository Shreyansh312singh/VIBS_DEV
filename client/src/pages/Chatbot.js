// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import "../css/Chatbot.css";

// export default function ChatbotPage() {
//   const { sessionId } = useParams();
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const chatEndRef = useRef(null);
//   const location = useLocation();
//   const { companyEmail, investorEmail, companyName } = location.state || {};

//   useEffect(() => {
//     // Scroll to bottom
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     // Cleanup on browser back button
//     const handleBackButton = async () => {
//       try {
//         await fetch("http://localhost:4000/end-chat", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ sessionId }),
//         });
//         console.log("Session ended due to browser back");
//       } catch (err) {
//         console.error("Error ending session on back:", err);
//       }
//     };

//     window.addEventListener("popstate", handleBackButton);

//     return () => {
//       window.removeEventListener("popstate", handleBackButton);
//     };
//   }, [sessionId]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: "user", content: input };
//     setMessages(prev => [...prev, userMessage]);

//     try {
//       const res = await fetch("http://localhost:4000/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sessionId, question: input }),
//       });
//       const data = await res.json();
//       const botMessage = { role: "bot", content: data.answer };
//       setMessages(prev => [...prev, botMessage]);
//     } catch (err) {
//       console.error("Error talking to chatbot:", err);
//       setMessages(prev => [...prev, { role: "bot", content: "Something went wrong." }]);
//     }

//     setInput("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   const endSession = async () => {
//     try {
//       await fetch("http://localhost:4000/end-chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sessionId }),
//       });
//       console.log("Session ended manually");
//     } catch (err) {
//       console.error("Error ending session:", err);
//     }
//     console.log(companyEmail);
//     console.log(investorEmail);
//     console.log(companyName);
//     navigate("/companies-data");
//   };

//   return (
//     <div className="chatbot-container">
//       <div className="chat-header">
//         <h2>Business Pitch Chatbot</h2>
//         <button onClick={endSession}>← Back to Companies</button>
//       </div>

//       <div className="chat-window">
//         {messages.map((msg, i) => (
//           <div key={i} className={`message ${msg.role}`}>
//             {msg.content}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <div className="chat-input">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Ask a question about the business..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../css/Chatbot.css";

export default function ChatbotPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { companyEmail, investorEmail, companyName } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dealPending, setDealPending] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Cleanup session on browser back
  useEffect(() => {
    const handleBackButton = async () => {
      try {
        await fetch("http://localhost:4000/end-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        console.log("Session ended due to browser back");
      } catch (err) {
        console.error("Error ending session on back:", err);
      }
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, [sessionId]);

  // Check if deal already exists
  useEffect(() => {
    const checkDealStatus = async () => {
      try {
        console.log(companyName);
        const res = await fetch("http://localhost:5000/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ investorEmail, companyName }),
        });
        const data = await res.json();
        if (data.status === "pending") {
          setDealPending(true);
        }
      } catch (err) {
        console.error("Error checking deal status:", err);
      }
    };

    if (investorEmail && companyEmail) {
      checkDealStatus();
    }
  }, [investorEmail, companyEmail]);

  // Handle message send
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:4000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, question: input }),
      });
      const data = await res.json();
      const botMessage = { role: "bot", content: data.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Error talking to chatbot:", err);
      setMessages(prev => [...prev, { role: "bot", content: "Something went wrong." }]);
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const endSession = async () => {
    try {
      await fetch("http://localhost:4000/end-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      console.log("Session ended manually");
    } catch (err) {
      console.error("Error ending session:", err);
    }

    navigate("/companies-data");
  };

  const handleDealClick = async () => {
    const confirm = window.confirm(`Are you sure you want to initiate a deal with ${companyName}?`);
    if (!confirm) return;

    try {
      const res = await fetch("http://localhost:5000/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorEmail,
          companyEmail,
          companyName,
        }),
      });

      const data = await res.json();
      if (data.status === "already_exists") {
        alert("This deal is already pending.");
        setDealPending(true);
      } else if (data.success) {
        alert("Deal successfully initiated!");
        setDealPending(true);
      }
    } catch (err) {
      console.error("Error posting deal:", err);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h2>Business Pitch Chatbot</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={endSession}>← Back to Companies</button>
          <button
            onClick={handleDealClick}
            disabled={dealPending}
            style={{
              backgroundColor: dealPending ? "gray" : "#28a745",
              color: "white",
              cursor: dealPending ? "not-allowed" : "pointer"
            }}
          >
            {dealPending ? "Deal Pending" : "Discuss Deal"}
          </button>
        </div>
      </div>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the business..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
