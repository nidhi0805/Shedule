.eva-bot-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}

.eva-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.eva-chatbot {
  width: 320px;
  background-color: #fefefe;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.eva-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #9370db;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
}

.eva-header-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.eva-chat-window {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff5f9;
}

.chat-message {
  padding: 8px 12px;
  border-radius: 15px;
  max-width: 80%;
  word-wrap: break-word;
}

.chat-message.eva {
  background-color: #9370db;
  align-self: flex-start;
}

.chat-message.user {
  background-color: #d1eaff;
  align-self: flex-end;
}

.eva-options {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: #fff0f6;
}

.eva-options button {
  padding: 6px 12px;
  background-color: #9370db;
  border: none;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.eva-options button:hover {
  background-color: #9370db;
}

.eva-input-area {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff0f6;
}

.eva-input-area label {
  margin-bottom: 5px;
  font-weight: 500;
}

.eva-input-area input[type="date"] {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.eva-back-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.eva-back-button {
  background-color: #eee;
  color: #333;
  padding: 6px 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.eva-back-button:hover {
  background-color: #ddd;
}
