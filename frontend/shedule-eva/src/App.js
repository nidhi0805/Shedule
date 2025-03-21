import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import eva from './eva-avatar.jpg'; // Replace with your own Eva gif in src folder

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
    return "Hi! I’m Eva 😊 Let me know if you'd like help organizing your day.";
  };

  return (
    <div className="app">
      <h1>Shedule </h1>
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

      <div className="eva-assistant">
        <img src={eva} alt="Eva" className="eva-avatar" />
        <div className="eva-chat">{evaSuggests()}</div>
      </div>
    </div>
  );
};

export default App;
