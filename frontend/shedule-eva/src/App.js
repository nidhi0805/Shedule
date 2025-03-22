import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import React, { useState, useEffect } from "react";
import Chatbot from './pages/chatbot';
<<<<<<< Updated upstream
import Signup from "./newsignup";
import Categories from './categories'; 
=======
import Signup from "./signup";
import CustomCalendar from "./pages/calendar/calendar";



>>>>>>> Stashed changes


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

  useEffect(() => {
    const greeting = "Hi! I'm Eva, your personal planning assistant. Let me know if you'd like help scheduling your day.";
  
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(greeting);
      utterance.lang = "en-US";
  
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(
        voice =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("google") ||
          voice.lang === "en-US"
      );
  
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
  
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    };
  
    const handleUserInteraction = () => {
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = speak;
      } else {
        speak();
      }
  
      // Remove listener so it only speaks once
      window.removeEventListener("click", handleUserInteraction);
    };
  
    // Wait for any user interaction before speaking
    window.addEventListener("click", handleUserInteraction);
  
    return () => {
      window.removeEventListener("click", handleUserInteraction);
    };
  }, []);
  
  return (
    <div className="app">
<<<<<<< Updated upstream
      <h1>Shedule</h1>
      <Calendar value={selectedDate} onChange={setSelectedDate} />
      <h2>Schedule for {selectedDate.toDateString()}</h2>
      <div className="schedule">
        {timeSlots.map((time) => (
          <div key={time} className="time-block">
            <div className="time-label">{time}</div>
            {tasks[selectedDate.toDateString()]?.[time] ? (
              <div className={`task ${tasks[selectedDate.toDateString()][time].type.toLowerCase()}`}>
                {tasks[selectedDate.toDateString()][time].name}
              </div>
            ) : (
              <button onClick={() => handleAddTask(time)}>+</button>
            )}
          </div>
        ))}
      </div>
  
      {showForm.open && (
        <div className="popup">
          <h3>Add Task @ {showForm.time}</h3>
          <input
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <select
            value={newTask.type}
            onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
          >
            <option>Work</option>
            <option>Self-care</option>
            <option>Chore</option>
            <option>Workout</option>
          </select>
          <button onClick={handleSubmit}>Save</button>
        </div>
      )}
  
      {/* Eva assistant component */}
      <Chatbot />
  
      {/* Signup component */}
      <Signup />
  
      {/* Categories component */}
      <Categories />
=======
      {/* <h1>Shedule </h1>
      <Calendar value={selectedDate} onChange={setSelectedDate} />
     

    
<Chatbot />
<Signup/> */}
<CustomCalendar/>
>>>>>>> Stashed changes
    </div>
  )};
  
//   return (
//     <div className="app">
//       <h1>Shedule </h1>
//       <Calendar value={selectedDate} onChange={setSelectedDate} />
//       <h2>Schedule for {selectedDate.toDateString()}</h2>
//       <div className="schedule">
//         {timeSlots.map((time) => (
//           <div key={time} className="time-block">
//             <div className="time-label">{time}</div>
//             {tasks[selectedDate.toDateString()]?.[time] ? (
//               <div className={`task ${tasks[selectedDate.toDateString()][time].type.toLowerCase()}`}>
//                 {tasks[selectedDate.toDateString()][time].name}
//               </div>
//             ) : (
//               <button onClick={() => handleAddTask(time)}>+</button>
//             )}
//           </div>
//         ))}
//       </div>

//       {showForm.open && (
//         <div className="popup">
//           <h3>Add Task @ {showForm.time}</h3>
//           <input
//             placeholder="Task Name"
//             value={newTask.name}
//             onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
//           />
//           <select
//             value={newTask.type}
//             onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
//           >
//             <option>Work</option>
//             <option>Self-care</option>
//             <option>Chore</option>
//             <option>Workout</option>
//           </select>
//           <button onClick={handleSubmit}>Save</button>
//         </div>
//       )}

//       {/* Eva assistant component */}
// <Chatbot />
// <Signup/>
//     </div>
//   );
// };


export default App;
