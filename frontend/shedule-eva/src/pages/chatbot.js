
import React, { useState, useEffect } from "react";
import "./Chatbot.css";
import eva from "../images/eva-avatar.jpg";

const Chatbot = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [awaitingDate, setAwaitingDate] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [evaOptions, setEvaOptions] = useState(null);

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
      (v) =>
        (v.name.toLowerCase().includes("soft") ||
         v.name.toLowerCase().includes("female") ||
         v.name.toLowerCase().includes("samantha") ||
         v.name.toLowerCase().includes("google us english")) &&
        v.lang === "en-US"
    );
    if (evaVoice) utterance.voice = evaVoice;

    utterance.pitch = 1.2;
    utterance.rate = 1;
    utterance.volume = 0.7;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const greetUser = async () => {
    console.log("Sending greet request...");
    const res = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "greet" }),
    });
    const data = await res.json();
    console.log("Greet Response:", data);
    setMessages([{ sender: "eva", text: data.reply }]);
    setShowBack(false);
};


  const handleYes = async () => {
    const res = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "cycle_opt_in_yes" }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { sender: "eva", text: data.reply }]);
    setAwaitingDate(true);
  };

  const handleEvaOptionClick = async (option) => {
    console.log("Option clicked:", option);
  
    if (option === "Enter date again") {
      setAwaitingDate(true);
      setEvaOptions(null);
      setMessages((prev) => [...prev, { sender: "eva", text: "Sure! Please select the date your last period started." }]);
      return;
    }
  
    if (option === "More options") {
      const res = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "more_options" }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "eva", text: data.reply }]);
      setEvaOptions(data.options);
      return;
    }
  
    if (["Pregnant", "Menopausal", "PCOS"].includes(option)) {
      const normalizedIntent = option.toLowerCase();
  
      const res = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: normalizedIntent }),
      });
  
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "eva", text: data.reply }]);
      setEvaOptions(null);
      setShowBack(true);
    }
  };
  
  
  const handleDateSubmit = async (e) => {
    const rawDate = e.target.value;
    const formattedDate = new Date(rawDate).toISOString().split("T")[0];
    const email = sessionStorage.getItem('userEmail');  // Assuming the email is saved in session storage
    const currentDate = new Date().toISOString().split("T")[0]; 

    console.log(email);
    console.log(currentDate)

    if (!email) {
      alert("Email is not available in session storage.");
      return;
    }
    const res = await fetch("http://localhost:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "submit_period_date",
        lastPeriodDate: formattedDate,
        email: email,
        currentDate: currentDate
      }),
    });
    const data = await res.json();

    if (data.options) {
      setEvaOptions(data.options); // ["Enter date again", "More options"]
      setAwaitingDate(false);
      return;
    }

    setMessages((prev) => [...prev, { sender: "eva", text: data.reply }]);
    setAwaitingDate(false);
    setShowBack(true);
  };

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.sender === "eva") speak(last.text);
  }, [messages, voicesLoaded, userHasInteracted]);

  useEffect(() => {
    if (expanded && messages.length === 0) greetUser();
  }, [expanded, messages]);

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
            <button onClick={() => {setExpanded(false);
                                  speechSynthesis.cancel();
            }}>✖</button>
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
              <button onClick={handleYes}>Yes</button>
              <button onClick={() => setMessages((prev) => [...prev, { sender: "eva", text: "No worries! Let me know how else I can help." }])}>
                No
              </button>
            </div>
          )}

          {awaitingDate && (
            <div className="eva-input-area">
              <label>Select Last Period Date:</label>
              <input type="date" onChange={handleDateSubmit} 
              min="2022-01-01"
              max={new Date().toISOString().split("T")[0]}/>
            </div>
          )}

          {evaOptions && (
            <div className="eva-options">
              {evaOptions.map((opt) => (
                <button key={opt} onClick={() => handleEvaOptionClick(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {showBack && (
            <div className="eva-back-container">
              <button className="eva-back-button" 
              onClick={async() => {setAwaitingDate(false); setEvaOptions(null); setShowBack(false); setMessages([]); await greetUser(); speechSynthesis.cancel();}}>
              Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
