import React, { useState, useEffect } from "react";
import "./Chatbot.css";
import eva from "../images/eva-avatar.jpg";

const Chatbot = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [awaitingDate, setAwaitingDate] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [showBack, setShowBack] = useState(false); // NEW

  // Load voices
  useEffect(() => {
    const handleVoices = () => setVoicesLoaded(true);
    if (speechSynthesis.getVoices().length > 0) {
      setVoicesLoaded(true);
    } else {
      speechSynthesis.addEventListener("voiceschanged", handleVoices);
    }
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", handleVoices);
    };
  }, []);

  const speak = (text) => {
    if (!voicesLoaded || !userHasInteracted) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    const voices = speechSynthesis.getVoices();
    const evaVoice = voices.find(
      (voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("google") ||
        voice.lang === "en-US"
    );
    if (evaVoice) {
      utterance.voice = evaVoice;
    }
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const greetUser = async () => {
    const response = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "greet" }),
    });
    const data = await response.json();
    const greetMsg = { sender: "eva", text: data.reply };
    setMessages([greetMsg]);
    setShowBack(false); // Hide back button on restart
  };

  const handleYes = async () => {
    const response = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "cycle_opt_in_yes" }),
    });
    const data = await response.json();
    setMessages((prev) => [...prev, { sender: "eva", text: data.reply }]);
    setAwaitingDate(true);
  };

  const handleBack = () => {
    setAwaitingDate(false);
    setShowBack(false);
    const msg = {
      sender: "eva",
      text: "Would you like us to tailor your suggestions based on your cycle?",
    };
    setMessages([msg]);
  };

  const handleDateSubmit = async (e) => {
    const rawDate = e.target.value;
    const formattedDate = new Date(rawDate).toISOString().split("T")[0];
    const response = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "submit_period_date",
        lastPeriodDate: formattedDate,
      }),
    });
    const data = await response.json();
    const finalMsg = { sender: "eva", text: data.reply };
    setMessages((prev) => [...prev, finalMsg]);
    setAwaitingDate(false);
    setShowBack(true); // ✅ Show back button now that suggestions are shown
  };

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === "eva") {
      speak(lastMsg.text);
    }
  }, [messages, voicesLoaded, userHasInteracted]);

  useEffect(() => {
    if (expanded && messages.length === 0) {
      greetUser();
    }
  }, [expanded]);

  return (
    <div className="eva-bot-wrapper">
      {!expanded && (
        <img
          src={eva}
          alt="Eva"
          className="eva-avatar"
          onClick={() => {
            setUserHasInteracted(true);
            setExpanded(true);
          }}
        />
      )}
      {expanded && (
        <div className="eva-chatbot">
          <div className="eva-header">
            <img src={eva} alt="Eva Icon" className="eva-header-icon" />
            <span>Eva</span>
            <button onClick={() => setExpanded(false)}>✖</button>
          </div>

          <div className="eva-chat-window">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          {!awaitingDate && messages.length === 1 && (
            <div className="eva-options">
              <button onClick={handleYes}>Yes </button>
              <button
                onClick={() => {
                  const msg = {
                    sender: "eva",
                    text: "No worries! Let me know how else I can help.",
                  };
                  setMessages((prev) => [...prev, msg]);
                }}
              >
                No 
              </button>
            </div>
          )}

          {awaitingDate && (
            <div className="eva-input-area">
              <label>Select Last Period Date:</label>
              <input type="date" onChange={handleDateSubmit} />
            </div>
          )}

          {showBack && (
            <div className="eva-back-container">
              <button className="eva-back-button" onClick={handleBack}>
                🔙 Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
