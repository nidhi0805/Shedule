import React, { useEffect, useState } from "react";
import "./Chatbot.css";
import eva from "../images/eva-avatar.jpg"; // Ensure this path is correct

const Chatbot = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "eva", text: "Hi! I'm Eva 👋. Let me know how I can help you today!" },
  ]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const speak = (text) => {
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

    if (expanded) {
      speak("Hi! I'm Eva, your personal planning assistant. Let me know how I can help!");
    }
  }, [expanded]);

  const handleSend = async () => {
    if (userInput.trim() === "") return;
  
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
  
    try {
      const response = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          name: "EvaUser" // optional, for personalization
        })
      });
  
    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      { sender: "eva", text: data.reply },
    ]);

    const utterance = new SpeechSynthesisUtterance(data.reply);
    utterance.lang = "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);

  } catch (error) {
    console.error("Eva API error:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "eva", text: "Sorry, I couldn't connect right now." },
    ]);

    }
  
    setUserInput("");
  };

  return (
    <div className="eva-bot-wrapper">
      {!expanded && (
        <img
          src={eva}
          alt="Eva"
          className="eva-avatar"
          onClick={() => setExpanded(true)}
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
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${msg.sender === "eva" ? "eva-msg" : "user-msg"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="eva-input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
