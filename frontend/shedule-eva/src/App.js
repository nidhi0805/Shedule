import "react-calendar/dist/Calendar.css";
import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";  
import Chatbot from './pages/chatbot';
import CustomCalendar from "./pages/calendar/calendar";
import Signup from "./pages/newsignup";
import Categories from "./pages/categories";
import Day from "./pages/calendar/day";
import Navbar from "./pages/navbar";

const timeSlots = Array.from({ length: 16 }, (_, i) => `${i + 7}:00`);

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [showForm, setShowForm] = useState({ time: null, open: false });
  const [newTask, setNewTask] = useState({ name: "", type: "Work" });

  const handleAddTask = (time) => {
    setShowForm({ time, open: true });
  };

  const handleSubmit = () => {
    const key = selectedDate.toDateString();
    const updated = { ...(tasks[key] || {}) };
    updated[showForm.time] = { ...newTask };
    setTasks({ ...tasks, [key]: updated });
    setShowForm({ time: null, open: false });
    setNewTask({ name: "", type: "Work" });
  };

  const evaSuggests = () => {
    const todayTasks = tasks[selectedDate.toDateString()] || {};
    const taskCount = Object.keys(todayTasks).length;
    if (taskCount >= 4) return "You've scheduled a lot today! Want to add a break?";
  };

  
  return (
    <div className="app">
      <Navbar />
      <Chatbot />
      <Routes>
      <Route path="/" element={<Signup />} /> 
        <Route path="/Calendar" element={<CustomCalendar />} /> 
        <Route path="/Categories/:year/:month/:day" element={<Categories />} />
        <Route path="/Schedule/:year/:month/:day" element={<Day />} />
      </Routes>
    </div>
  );
};

// const CalendarPage = () => {
//   return (
//     <div className="calendar-page-container">
//       <div className="calendar-container">
//         <CustomCalendar />
//       </div>
//       <div className="summary-container">
//         <Summary />
//       </div>
//     </div>
//   );
// };

export default App;
